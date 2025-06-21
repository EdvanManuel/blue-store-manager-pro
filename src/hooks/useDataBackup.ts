
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAllStores, getAllProducts } from '@/data/storeData';

export interface BackupData {
  id: string;
  timestamp: Date;
  stores: any[];
  products: any[];
  size: number;
  checksum: string;
}

export const useDataBackup = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);

  const generateChecksum = (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  };

  const createBackup = async (): Promise<BackupData | null> => {
    setIsBackingUp(true);
    
    try {
      const stores = getAllStores();
      const products = getAllProducts();
      
      const backupData = {
        stores,
        products,
        metadata: {
          version: '1.0',
          createdAt: new Date().toISOString(),
          totalStores: stores.length,
          totalProducts: products.length
        }
      };

      const dataString = JSON.stringify(backupData);
      const checksum = generateChecksum(dataString);
      
      const backup: BackupData = {
        id: `backup-${Date.now()}`,
        timestamp: new Date(),
        stores,
        products,
        size: new Blob([dataString]).size,
        checksum
      };

      // Salvar no localStorage como backup local
      const existingBackups = JSON.parse(localStorage.getItem('system_backups') || '[]');
      const updatedBackups = [backup, ...existingBackups].slice(0, 10); // Manter apenas 10 backups
      localStorage.setItem('system_backups', JSON.stringify(updatedBackups));

      setBackups(updatedBackups);
      setLastBackup(new Date());

      toast.success('Backup criado com sucesso!', {
        description: `${stores.length} lojas e ${products.length} produtos salvos`
      });

      return backup;
    } catch (error) {
      toast.error('Erro ao criar backup', {
        description: 'Não foi possível salvar os dados'
      });
      return null;
    } finally {
      setIsBackingUp(false);
    }
  };

  const restoreFromBackup = async (backupId: string): Promise<boolean> => {
    try {
      const backup = backups.find(b => b.id === backupId);
      if (!backup) {
        toast.error('Backup não encontrado');
        return false;
      }

      // Verificar integridade
      const dataString = JSON.stringify({ stores: backup.stores, products: backup.products });
      const currentChecksum = generateChecksum(dataString);
      
      if (currentChecksum !== backup.checksum) {
        toast.error('Backup corrompido', {
          description: 'Os dados do backup podem estar danificados'
        });
        return false;
      }

      // Restaurar dados
      localStorage.setItem('stores', JSON.stringify(backup.stores));
      localStorage.setItem('products', JSON.stringify(backup.products));

      toast.success('Dados restaurados com sucesso!', {
        description: 'Sistema foi restaurado para o estado do backup'
      });

      // Recarregar a página para aplicar as mudanças
      window.location.reload();
      
      return true;
    } catch (error) {
      toast.error('Erro ao restaurar backup');
      return false;
    }
  };

  const exportBackup = (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) {
      toast.error('Backup não encontrado');
      return;
    }

    const exportData = {
      ...backup,
      exportedAt: new Date().toISOString(),
      systemInfo: {
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blue-store-backup-${backup.timestamp.toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Backup exportado com sucesso!');
  };

  const importBackup = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // Validar estrutura do backup
      if (!importedData.stores || !importedData.products || !importedData.checksum) {
        toast.error('Arquivo de backup inválido');
        return false;
      }

      // Verificar integridade
      const dataString = JSON.stringify({ 
        stores: importedData.stores, 
        products: importedData.products 
      });
      const currentChecksum = generateChecksum(dataString);
      
      if (currentChecksum !== importedData.checksum) {
        toast.warning('Aviso: Checksum não confere, mas importando mesmo assim...');
      }

      const newBackup: BackupData = {
        id: `imported-${Date.now()}`,
        timestamp: new Date(importedData.timestamp),
        stores: importedData.stores,
        products: importedData.products,
        size: file.size,
        checksum: importedData.checksum
      };

      setBackups(prev => [newBackup, ...prev].slice(0, 10));

      toast.success('Backup importado com sucesso!', {
        description: 'Use "Restaurar" para aplicar os dados'
      });

      return true;
    } catch (error) {
      toast.error('Erro ao importar backup', {
        description: 'Arquivo pode estar corrompido ou em formato inválido'
      });
      return false;
    }
  };

  const scheduleAutoBackup = () => {
    const performAutoBackup = () => {
      if (!lastBackup || (Date.now() - lastBackup.getTime()) > 24 * 60 * 60 * 1000) {
        createBackup();
      }
    };

    // Backup automático a cada hora
    const interval = setInterval(performAutoBackup, 60 * 60 * 1000);
    
    // Backup inicial se necessário
    performAutoBackup();

    return () => clearInterval(interval);
  };

  useEffect(() => {
    // Carregar backups existentes
    const existingBackups = JSON.parse(localStorage.getItem('system_backups') || '[]');
    setBackups(existingBackups);

    if (existingBackups.length > 0) {
      setLastBackup(new Date(existingBackups[0].timestamp));
    }

    // Configurar backup automático
    const cleanup = scheduleAutoBackup();

    return cleanup;
  }, []);

  const deleteBackup = (backupId: string) => {
    const updatedBackups = backups.filter(b => b.id !== backupId);
    setBackups(updatedBackups);
    localStorage.setItem('system_backups', JSON.stringify(updatedBackups));
    
    toast.success('Backup removido');
  };

  return {
    backups,
    isBackingUp,
    lastBackup,
    createBackup,
    restoreFromBackup,
    exportBackup,
    importBackup,
    deleteBackup
  };
};

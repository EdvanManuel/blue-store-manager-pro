
import { useState, useCallback } from 'react';

export interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
  taxNumber: string;
  email?: string;
  createdAt: string;
}

const STORAGE_KEY = 'customers_data';

export const useCustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [
      {
        id: 1,
        name: 'Cliente Diverso',
        address: '',
        phone: '',
        taxNumber: '',
        email: '',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const saveToStorage = useCallback((customerList: Customer[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customerList));
  }, []);

  const addCustomer = useCallback((customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    saveToStorage(updatedCustomers);
    
    return newCustomer;
  }, [customers, saveToStorage]);

  const updateCustomer = useCallback((id: number, updates: Partial<Customer>) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === id ? { ...customer, ...updates } : customer
    );
    setCustomers(updatedCustomers);
    saveToStorage(updatedCustomers);
  }, [customers, saveToStorage]);

  const deleteCustomer = useCallback((id: number) => {
    // Não permitir deletar o "Cliente Diverso" (id: 1)
    if (id === 1) return;
    
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
    saveToStorage(updatedCustomers);
  }, [customers, saveToStorage]);

  const getCustomerById = useCallback((id: number) => {
    return customers.find(customer => customer.id === id);
  }, [customers]);

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById
  };
};

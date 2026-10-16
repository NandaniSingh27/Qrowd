import { useState, useEffect } from 'react';

const generateId = () => {
  return 'voter-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const useVoterId = () => {
  const [voterId, setVoterId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem('voterId');
    if (!id) {
      id = generateId();
      localStorage.setItem('voterId', id);
    }
    setVoterId(id);
  }, []);

  return voterId;
};
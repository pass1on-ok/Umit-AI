"use client";
import { useEffect, useState } from 'react';
import { Table, Button, Badge, Select } from '@/shared/ui'; // Предполагаем наличие UI-кита

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  // Mock-загрузка (в реальности используем src/shared/api)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление пользователями</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">Роль</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {/* Здесь будет map по пользователям */}
          <tr>
            <td className="border p-2">user@example.com</td>
            <td className="border p-2"><Badge>Patient</Badge></td>
            <td className="border p-2">
              <Button variant="outline" size="sm">Изменить роль</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
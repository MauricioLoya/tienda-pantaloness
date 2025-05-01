import React from 'react';

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    superAdmin?: boolean;
    isDeleted?: boolean;
  };
}

const ProfileDetails: React.FC<Props> = ({ user }) => (
  <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
    <h2 className="text-3xl font-semibold text-gray-800 mb-2">{user.name}</h2>
    <p className="text-gray-600 mb-4">{user.email}</p>
    <div className="w-full max-w-xs bg-gray-100 p-4 rounded-md">
      <ul className="space-y-2 text-gray-700">
        <li><strong>Super Admin:</strong> {user.superAdmin ? 'Sí' : 'No'}</li>
        <li><strong>Eliminado:</strong> {user.isDeleted ? 'Sí' : 'No'}</li>
      </ul>
    </div>
  </div>
);

export default ProfileDetails;

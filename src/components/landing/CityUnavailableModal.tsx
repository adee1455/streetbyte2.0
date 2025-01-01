import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface CityUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
}

export const CityUnavailableModal: React.FC<CityUnavailableModalProps> = ({
  isOpen,
  onClose,
  cityName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">City Not Available</h3>
        <p className="mt-2 text-sm text-gray-500">
          We're sorry! {cityName} is not yet available on StreetByte. We're working hard to expand our coverage.
        </p>
        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Try Another City
          </Button>
        </div>
      </div>
    </Modal>
  );
};
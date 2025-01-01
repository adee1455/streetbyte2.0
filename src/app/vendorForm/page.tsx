import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Camera, MapPin, Info, PhoneCallIcon, Star, User2Icon } from 'lucide-react';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { storage } from '../../../src/lib/appwrite';
import { ID } from 'appwrite';
import { link } from 'fs';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  foodType: string;
  address: string;
  rating: string;
  contact_number: string;
  description: string;
  created_by: string;
}
interface ImgData{
  images: FileList | null;
  menu: FileList | null;
}

export const VendorForm = () => {

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    contact_number: '',
    rating: '',
    foodType: '',
    created_by: '',
  });
  const [ImgData,setImgData] = useState<ImgData>({
    images: null,
    menu: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [menuPreviews, setMenuPreviews] = useState<string[]>([]);
  const id = Date.now().toString();
 

  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.foodType) newErrors.foodType = 'Food type is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.contact_number) newErrors.contact_number = 'Phone number is required';
    if (!formData.description) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const existingVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
   
    const newVendor = {
      id,
      ...formData,
      created_by: formData.created_by || 101,
    };

    // Upload vendor images
    const vendorImageUrls = await uploadImages(ImgData.images);
    const menuImageUrls = await uploadImages(ImgData.menu);

    // Insert vendor into the database
    await insertVendor(newVendor, vendorImageUrls, menuImageUrls);

    localStorage.setItem('vendors', JSON.stringify([...existingVendors, newVendor]));

    <Link href={"/home"}></Link>
  };

  const uploadImages = async (files: FileList | null): Promise<string[]> => {
    if (!files) return [];

    const urls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const response = await storage.createFile(
          '676ab6de002caef140d0',
          ID.unique(),
          file
        );
        const url = response.$id;
        const imgUrl = storage.getFilePreview('676ab6de002caef140d0', url)
        urls.push(imgUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle the error as needed (e.g., show a notification)
      }
    }
    return urls;
  };

  const insertVendor = async (vendor: any, vendorImageUrls: string[], menuImageUrls: string[]) => {
    // Insert vendor into the database
    const response = await fetch('/api/vendors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendor), // Ensure no created_by field is included
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create vendor: ${errorData.message}`);
    }
  
    const vendorData = await response.json();
    // const vendorId = vendorData.id; // Get the newly created vendor ID
  
    // Insert vendor images
    for (const url of vendorImageUrls) {
      const imageData = {
        id: Date.now().toString(), // Generate a unique ID for the image
        vendor_id: vendor.id, // Use the newly created vendor ID
        image_url: url,
      };
      console.log('Inserting vendor image data:', imageData); // Debugging line
  
      await fetch('/api/vendor-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
    }
  
    // Insert menu images
    for (const url of menuImageUrls) {
      const menuData = {
        id: Date.now().toString(), // Generate a unique ID for the menu item
        vendor_id: vendor.id, // Use the newly created vendor ID
        image_url: url,
      };
      console.log('Inserting menu image data:', menuData); // Debugging line
  
      await fetch('/api/menu-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuData),
      });
    }
  };
const router = useRouter();

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold font-ProximaBold italic text-gray-900 mb-6">Add New Food Outlet</h1>

      <Input
        label="Outlet Name"
        placeholder='Outlet Name*'
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Outlet Images (min 1)*</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="images"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setImgData((prevData) => ({
                  ...prevData,
                  images: files,
                }));
                const newImagePreviews = Array.from(files).map(file => URL.createObjectURL(file));
                setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
              }
            }}
          />
          <label htmlFor="images" className="cursor-pointer">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Upload images</span>
          </label>
        </div>
      </div>
      
      {imagePreviews.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-700">Selected Images:</h3>
          <div className="flex space-x-2">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Food Type*
        </label>
        <select
          value={formData.foodType}
          onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          required
        >
          <option value="">Select Food Type</option>
          <option value="vegetarian">Street Food</option>
          <option value="non-vegetarian">Fast Food</option>
          <option value="vegan">Beverages</option>
          <option value="gluten-free">Desserts</option>
          <option value="gluten-free">Fine Dine</option>
        </select>
      </div>

      <Input
        label="Address"
        icon={<MapPin className="w-5 h-5" />}
        placeholder='Address*'
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        error={errors.address}
        required
      />

      <Input
        label="Phone Number"
        icon={<PhoneCallIcon className="w-4 h-4" />}
        placeholder='Phone No.'
        value={formData.contact_number}
        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
        error={errors.contact_number}
        required
      />
      
      <Input
        label="rating"
        icon={<Star className="w-5 h-5" />}
        placeholder='Rating'
        value={formData.rating}
        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        error={errors.rating}
        required
      />

      <Input
        label="createdby"
        icon={<User2Icon className="w-5 h-5" />}
        placeholder='Your Name'
        value={formData.created_by}
        onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
        error={errors.created_by}
        required
      />
        <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">

             </label>
                <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 "
                placeholder="Describe the outlet..."
                required
              />
            </div>
            
      
      

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Menu</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="menu"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setImgData((prevData) => ({
                  ...prevData,
                  menu: files,
                }));
                const newMenuPreviews = Array.from(files).map(file => URL.createObjectURL(file));
                setMenuPreviews((prevPreviews) => [...prevPreviews, ...newMenuPreviews]);
              }
            }}
          />
          <label htmlFor="menu" className="cursor-pointer">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Upload menu images</span>
          </label>
        </div>
      </div>

      {menuPreviews.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-700">Selected Menu Images:</h3>
          <div className="flex space-x-2">
            {menuPreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Menu Preview ${index}`} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push('/home')}>
          Cancel
        </Button>
        <Button type="submit">Add Outlet</Button>
      </div>
    </form>
  );
};

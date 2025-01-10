"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Camera, MapPin, Info, PhoneCallIcon, Star, User2Icon } from 'lucide-react';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { storage } from '../../../src/lib/appwrite';
import { ID } from 'appwrite';
import { link } from 'fs';
import { useRouter } from 'next/navigation';
import { LocationInput } from '@/components/landing/LocationInput';
import { Loader2 } from 'lucide-react';
import { useLocationStore } from '../../store/locationStore';
import { searchCity } from '../../services/locationService';
import { useDebounce } from '../../hooks/useDebounce';
import { useSession } from 'next-auth/react';

interface FormData {
  name: string;
  foodType: string;
  address: string;
  city: string;
  rating: string;
  contact_number: string;
  description: string;
  created_by: string;
}
interface ImgData{
  images: FileList | null;
  menu: FileList | null;
}

export default function VendorForm() {

  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    city: '',
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
  const [selectedCity, setSelectedCity] = useState<string>('');

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { setCity } = useLocationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      try {
        const cities = await searchCity(debouncedQuery);
        setSuggestions(cities);
      } catch (err) {
        console.error('Failed to fetch city suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleCitySelect = (cityName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setQuery(cityName);
    setSuggestions([]);
    setFormData(prev => ({ ...prev, city: cityName }));
    console.log("Selected city:", cityName);
  };


  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.foodType) newErrors.foodType = 'Food type is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.description) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    if (!validateForm()) {
        console.log("Validation failed");
        return;
    }

    setIsSubmitting(true);

    try {
      const existingVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
     
      const newVendor = {
          id: Date.now().toString(),
          ...formData,
          created_by: session?.user.name,
      };

      console.log("Submitting vendor with data:", newVendor);

      // Upload vendor images
      const vendorImageUrls = await uploadImages(ImgData.images);
      const menuImageUrls = await uploadImages(ImgData.menu);

      // Insert vendor into the database
      await insertVendor(newVendor, vendorImageUrls, menuImageUrls);

      console.log(`New vendor added at: ${new Date().toLocaleString()}`);

      localStorage.setItem('vendors', JSON.stringify([...existingVendors, newVendor]));

      router.push('/home');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Optionally add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
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
          className="mt-1 p-2 block w-full rounded-md border text-gray-800 border-gray-300 shadow-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          required
        >
          <option value="">Select Food Type</option>
          <option value="StreetFood">Street Food</option>
          <option value="FastFood">Fast Food</option>
          <option value="Beverages">Beverages</option>
          <option value="Desserts">Desserts</option>
          <option value="FineDine">Fine Dine</option>
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

      <div>
      <div className="relative z-10">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your city"
            className="w-full pl-10 pr-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 animate-spin" />
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border text-gray-900 border-gray-200 max-h-60 overflow-y-auto z-20">
            {suggestions.map((city, index) => (
              <button
                type="button"
                key={index}
                onClick={(event) => handleCitySelect(city.name, event)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-gray-500 ml-2">{city.fullName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      </div>
       






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

      {/* <Input
        label="createdby"
        icon={<User2Icon className="w-5 h-5" />}
        placeholder='Your Name'
        value={formData.created_by}
        onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
        error={errors.created_by}
        required
      /> */}
        <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">

             </label>
                <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 text-black p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 "
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
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/home')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="relative"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding Outlet...
            </>
          ) : (
            'Add Outlet'
          )}
        </Button>
      </div>
    </form>
  );
};


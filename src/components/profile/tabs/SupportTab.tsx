import React from 'react';
import { MessageCircle, Phone, Mail, FileText } from 'lucide-react';

export const SupportTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">How can we help?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
            <MessageCircle className="w-6 h-6 text-red-500" />
            <div className="ml-3 text-left">
              <div className="font-medium">Chat with Us</div>
              <div className="text-sm text-gray-500">Available 24/7</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
            <Phone className="w-6 h-6 text-red-500" />
            <div className="ml-3 text-left">
              <div className="font-medium">Call Support</div>
              <div className="text-sm text-gray-500">Mon-Sat 9AM-6PM</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
            <Mail className="w-6 h-6 text-red-500" />
            <div className="ml-3 text-left">
              <div className="font-medium">Email Us</div>
              <div className="text-sm text-gray-500">Response within 24hrs</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
            <FileText className="w-6 h-6 text-red-500" />
            <div className="ml-3 text-left">
              <div className="font-medium">FAQs</div>
              <div className="text-sm text-gray-500">Quick answers</div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Common Questions</h3>
        <div className="space-y-4">
          {[
            'How do I add a new vendor?',
            'What are the verification requirements?',
            'How can I update my vendor information?',
            'How do reviews work?'
          ].map((question, index) => (
            <button
              key={index}
              className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
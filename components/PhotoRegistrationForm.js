import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../components/ui/alert';


const generatePhotoCode = (type) => {
  const prefix = type === 'Individual Portrait' ? 'WS-I-' : 'WS-G-';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return prefix + code;
};

const PhotoRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    shootCategory: 'Individual Portrait',
    photoCode: '',
    additionalEmails: [''],
    phoneNumber: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      photoCode: generatePhotoCode(prev.shootCategory)
    }));
  }, [formData.shootCategory]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEmail = () => {
    setFormData(prev => ({
      ...prev,
      additionalEmails: [...prev.additionalEmails, '']
    }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.additionalEmails];
    newEmails[index] = value;
    setFormData(prev => ({
      ...prev,
      additionalEmails: newEmails
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        // Replace with your actual Google Form ID
        const FORM_ID = '1qo8XKZ8V9Z6qCVtb0q8vjFN4XFM4lgQo5n6RWvDGOnk'; 
        
        // Replace these with your actual entry IDs from the pre-filled link
        const NAME_ID = 'entry.123456789'; // Replace with your actual ID
        const EMAIL_ID = 'entry.987654321'; // Replace with your actual ID
        const CATEGORY_ID = 'entry.123123123'; // Replace with your actual ID
        const CODE_ID = 'entry.456456456'; // Replace with your actual ID
        const ADDITIONAL_EMAILS_ID = 'entry.789789789'; // Replace with your actual ID
        const PHONE_ID = 'entry.321321321'; // Replace with your actual ID
        const NOTES_ID = 'entry.654654654'; // Replace with your actual ID
        
        // Construct the submission URL
        const formUrl = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
        
        // Create a hidden iframe to submit the form (avoids CORS issues)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Build the query string with form data
        const queryString = `?${NAME_ID}=${encodeURIComponent(formData.fullName)}` +
          `&${EMAIL_ID}=${encodeURIComponent(formData.email)}` +
          `&${CATEGORY_ID}=${encodeURIComponent(formData.shootCategory)}` +
          `&${CODE_ID}=${encodeURIComponent(formData.photoCode)}` +
          `&${ADDITIONAL_EMAILS_ID}=${encodeURIComponent(formData.additionalEmails.filter(Boolean).join(', '))}` +
          `&${PHONE_ID}=${encodeURIComponent(formData.phoneNumber)}` +
          `&${NOTES_ID}=${encodeURIComponent(formData.notes)}`;
        
        // Set the iframe source to submit the form
        iframe.src = formUrl + queryString;
        
        // Remove the iframe after submission and show success message
        setTimeout(() => {
          document.body.removeChild(iframe);
          setSubmitted(true);
        }, 1000);
        
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ 
          submission: 'There was an error submitting your registration. Please try again later.' 
        });
      }
    } else {
      setErrors(newErrors);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          Thank you! Your photo request has been submitted. Here is your photo code:
        </div>
        <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <h2 className="text-3xl font-mono text-center tracking-wider">
            {formData.photoCode}
          </h2>
          <p className="text-center mt-2 text-gray-600">
            Please show this code to your photographer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Photo Shoot Registration</h1>
      <div className="text-xl font-semibold text-green-600 mb-6">$30</div>

      {errors.submission && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
          {errors.submission}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Shoot Category *
          </label>
          <select
            name="shootCategory"
            value={formData.shootCategory}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="Individual Portrait">Individual Portrait</option>
            <option value="Group Portrait">Group Portrait</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Additional Email Contacts
          </label>
          {formData.additionalEmails.map((email, index) => (
            <input
              key={index}
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Additional email contact"
            />
          ))}
          <button
            type="button"
            onClick={handleAddEmail}
            className="text-blue-600 text-sm hover:text-blue-800"
          >
            + Add another email
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-32"
            placeholder="Any special requests for your photo shoot?"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default PhotoRegistrationForm;
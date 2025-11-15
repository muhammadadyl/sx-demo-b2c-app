import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface SignupPageProps {
  onNavigate: (page: string) => void;
  onSignup: (username: string, email: string) => void;
  onLogin: (username: string) => void;
}

export const Signup = ({ onNavigate, onSignup, onLogin }: SignupPageProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    userName: '',
    memberCardNumber: '',
    policyNumber: '',
    isSmsAuth: false,
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    // handle MFA radio group named "mfa"
    if (type === 'radio' && name === 'mfa') {
      const isSMS = value === 'sms';
      setFormData(prev => ({
        ...prev,
        isSmsAuth: isSMS,
        // clear phone number when switching off SMS
        phoneNumber: isSMS ? prev.phoneNumber : ''
      }));
      // clear phone error when switching
      if (errors.phoneNumber) {
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.userName.trim()) {
        newErrors.userName = 'User name is required'
    } else if (formData.userName.length < 6) {
        newErrors.userName = 'User name must be at least 6 characters long'
    } else if (!/^[a-zA-Z0-9-]+$/.test(formData.userName)) {
        newErrors.userName = 'User name can only contain letters, numbers, and hyphens'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.isSmsAuth) {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required for SMS authentication'; 
      } else if (!/^\+\d{1,3}\s?\d{4,14}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number is invalid. Include country code, e.g., +64 21 1234567';
      }
    }
    
    if (!formData.memberCardNumber.trim() && !formData.policyNumber.trim()) {
      newErrors.memberCardNumber = 'Either Member Card Number or Policy Number is required';
      newErrors.policyNumber = 'Either Member Card Number or Policy Number is required';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      callHttpVerifySignup(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const callHttpVerifySignup = async (data: typeof formData) => {
    try {
      const response = await fetch('https://verify-user-g2b9gtgwcjgcafh0.australiasoutheast-01.azurewebsites.net/api/verifyUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Verification result:', result);
        if (result.userExist) {
          onLogin(result.user.userName);
        } else {
          onSignup(data.userName, data.email);
        }
      } else if (response.status === 400) {
        const errorDetails = result.error || 'Verification failed. Please check your details.';
        console.error('Verification failed:', result);
        setErrors({ general: errorDetails });
      } else if (response.status === 500) {
        console.error('Verification failed:', result);
        setErrors({ general: result.error || 'Verification failed. Please check your details.' });
      }
    } catch (error) {
      console.error('Error verifying signup:', error);
      setErrors({ general: 'An error occurred during verification. Please try again later.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
        <div className="space-y-4">
          <label className="text-red-500 text-sm flex items-center gap-2">
            {errors.general && (
              <>
                <AlertCircle size={14} />
                {errors.general}
              </>
            )}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.dateOfBirth}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.userName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username (letters, numbers, hyphens only)"
              />
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.userName}
                </p>
              )}
            </div>
          </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="MultiFactorAuth" className="block text-sm font-medium text-gray-700 mb-2">
                Prefered second factor authentication
              </label>

              <div className="flex items-center space-x-3 mt-2">
                <label
                  htmlFor="rdEmail"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
                    !formData.isSmsAuth ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-200'
                  } cursor-pointer`}
                >
                  <input
                    type="radio"
                    id="rdEmail"
                    name="mfa"
                    value="email"
                    checked={!formData.isSmsAuth}
                    onChange={handleChange}
                    className="accent-purple-600 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Email</span>
                </label>

                <label
                  htmlFor="rdSMS"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
                    formData.isSmsAuth  ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-200'
                  } cursor-pointer`}
                >
                  <input
                    type="radio"
                    id="rdSMS"
                    name="mfa"
                    value="sms"
                    checked={formData.isSmsAuth}
                    onChange={handleChange}
                    className="accent-purple-600 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">SMS</span>
                </label>
              </div>
            </div>
            <div className={formData.isSmsAuth ? '' : 'hidden'}>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="+64 21 1234598"
                onChange={handleChange}
                disabled={!formData.isSmsAuth}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } ${ !formData.isSmsAuth ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="memberCardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Member Card Number
              </label>
              <input
                type="text"
                id="memberCardNumber"
                name="memberCardNumber"
                value={formData.memberCardNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.memberCardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.memberCardNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.memberCardNumber}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Policy Number
              </label>
              <input
                type="text"
                id="policyNumber"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.policyNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.policyNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.policyNumber}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 italic">
            * Either Member Card Number or Policy Number must be provided
          </p>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              Register
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

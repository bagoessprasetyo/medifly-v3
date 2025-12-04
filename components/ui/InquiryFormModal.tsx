import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { X, Calendar, User, Phone, Mail, Users, Stethoscope, Radio } from 'lucide-react';

 

interface InquiryFormModalProps {

  isOpen: boolean;

  onClose: () => void;

  defaultProcedure?: string;

}

 

interface FormData {

  name: string;

  dateOfBirth: string;

  contactNumber: string;

  email: string;

  gender: string;

  procedure: string;

  heardFrom: string;

}

 

const HEARD_FROM_OPTIONS = [

  'Google',

  'Referral',

  'Facebook',

  'Instagram',

  'Word of Mouth',

  'Event'

];

 

const GENDER_OPTIONS = [

  'Male',

  'Female',

  'Prefer not to say'

];

 

export const InquiryFormModal: React.FC<InquiryFormModalProps> = ({

  isOpen,

  onClose,

  defaultProcedure = ''

}) => {

  const [formData, setFormData] = useState<FormData>({

    name: '',

    dateOfBirth: '',

    contactNumber: '',

    email: '',

    gender: '',

    procedure: defaultProcedure,

    heardFrom: ''

  });

 

  const [errors, setErrors] = useState<Partial<FormData>>({});

 

  useEffect(() => {

    if (isOpen) {

      setFormData(prev => ({ ...prev, procedure: defaultProcedure }));

      document.body.style.overflow = 'hidden';

    } else {

      document.body.style.overflow = 'unset';

    }

    return () => {

      document.body.style.overflow = 'unset';

    };

  }, [isOpen, defaultProcedure]);

 

  const validateForm = (): boolean => {

    const newErrors: Partial<FormData> = {};

 

    if (!formData.name.trim()) {

      newErrors.name = 'Name is required';

    }

 

    if (!formData.dateOfBirth) {

      newErrors.dateOfBirth = 'Date of birth is required';

    }

 

    if (!formData.contactNumber.trim()) {

      newErrors.contactNumber = 'Contact number is required';

    }

 

    if (!formData.email.trim()) {

      newErrors.email = 'Email is required';

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {

      newErrors.email = 'Please enter a valid email';

    }

 

    if (!formData.gender) {

      newErrors.gender = 'Please select your gender';

    }

 

    if (!formData.procedure.trim()) {

      newErrors.procedure = 'Please specify your procedure/treatment inquiry';

    }

 

    if (!formData.heardFrom) {

      newErrors.heardFrom = 'Please let us know where you heard about us';

    }

 

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

 

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

 

    if (!validateForm()) return;

 

    // Format message for WhatsApp

    const message = `*New Treatment Inquiry*

 

*Name:* ${formData.name}

*Date of Birth:* ${formData.dateOfBirth}

*Contact Number:* ${formData.contactNumber}

*Email:* ${formData.email}

*Gender:* ${formData.gender}

*Procedure/Treatment:* ${formData.procedure}

*Heard About Us From:* ${formData.heardFrom}`;

 

    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/6281291690707?text=${encodedMessage}`;

 

    // Reset form

    setFormData({

      name: '',

      dateOfBirth: '',

      contactNumber: '',

      email: '',

      gender: '',

      procedure: '',

      heardFrom: ''

    });

    setErrors({});

    onClose();

 

    // Redirect to WhatsApp

    window.open(whatsappUrl, '_blank');

  };

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {

      setErrors(prev => ({ ...prev, [name]: undefined }));

    }

  };

 

  return (

    <AnimatePresence>

      {isOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center">

          {/* Backdrop */}

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{ duration: 0.2 }}

            className="absolute inset-0 bg-black/60 backdrop-blur-sm"

            onClick={onClose}

          />

 

          {/* Modal */}

          <motion.div

            initial={{ opacity: 0, scale: 0.95, y: 20 }}

            animate={{ opacity: 1, scale: 1, y: 0 }}

            exit={{ opacity: 0, scale: 0.95, y: 20 }}

            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}

            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"

          >

            {/* Header */}

            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">

              <motion.div

                initial={{ opacity: 0, x: -10 }}

                animate={{ opacity: 1, x: 0 }}

                transition={{ delay: 0.1 }}

              >

                <h2 className="text-xl font-semibold text-slate-900">Treatment Inquiry</h2>

                <p className="text-sm text-slate-500 mt-0.5">Fill out the form below and we'll get back to you</p>

              </motion.div>

              <motion.button

                whileHover={{ scale: 1.1 }}

                whileTap={{ scale: 0.9 }}

                onClick={onClose}

                className="p-2 hover:bg-slate-100 rounded-full transition-colors"

              >

                <X className="w-5 h-5 text-slate-500" />

              </motion.button>

            </div>

 

            {/* Form */}

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Name */}

              <motion.div

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.1 }}

              >

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">

                  <User className="w-4 h-4 text-slate-400" />

                  Full Name <span className="text-red-500">*</span>

                </label>

                <input

                  type="text"

                  name="name"

                  value={formData.name}

                  onChange={handleChange}

                  placeholder="Enter your full name"

                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all ${

                    errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'

                  }`}

                />

                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

              </motion.div>

 

              {/* Date of Birth */}

              <motion.div

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.15 }}

              >

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">

                  <Calendar className="w-4 h-4 text-slate-400" />

                  Date of Birth <span className="text-red-500">*</span>

                </label>

                <input

                  type="date"

                  name="dateOfBirth"

                  value={formData.dateOfBirth}

                  onChange={handleChange}

                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all ${

                    errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-slate-200'

                  }`}

                />

                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}

              </motion.div>

 

              {/* Contact Number */}

              <motion.div

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.2 }}

              >

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">

                  <Phone className="w-4 h-4 text-slate-400" />

                  Contact Number <span className="text-red-500">*</span>

                </label>

                <input

                  type="tel"

                  name="contactNumber"

                  value={formData.contactNumber}

                  onChange={handleChange}

                  placeholder="+62 xxx xxxx xxxx"

                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all ${

                    errors.contactNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'

                  }`}

                />

                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}

              </motion.div>

 

              {/* Email */}

              <motion.div

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.25 }}

              >

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">

                  <Mail className="w-4 h-4 text-slate-400" />

                  Email Address <span className="text-red-500">*</span>

                </label>

                <input

                  type="email"

                  name="email"

                  value={formData.email}

                  onChange={handleChange}

                  placeholder="your@email.com"

                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all ${

                    errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'

                  }`}

                />

                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

              </motion.div>

 

              {/* Gender */}

              <motion.div

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.3 }}

              >

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">

                  <Users className="w-4 h-4 text-slate-400" />

                  Gender <span className="text-red-500">*</span>

                </label>

                <div className="flex flex-wrap gap-3">

                  {GENDER_OPTIONS.map((option, idx) => (

                    <motion.label

                      key={option}

                      initial={{ opacity: 0, scale: 0.9 }}

                      animate={{ opacity: 1, scale: 1 }}

                      transition={{ delay: 0.3 + idx * 0.05 }}

                      whileHover={{ scale: 1.02 }}

                      whileTap={{ scale: 0.98 }}

                      className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer transition-all text-sm ${

                        formData.gender === option

                          ? 'border-slate-900 bg-slate-900 text-white'

                          : 'border-slate-200 hover:border-slate-300'

                      }`}

                    >

                      <input

                        type="radio"

                        name="gender"

                        value={option}

                        checked={formData.gender === option}

                        onChange={handleChange}

                        className="sr-only"

                      />

                      {option}

                    </motion.label>

                  ))}

                </div>

                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}

              </motion.div>

 

              {/* Procedure / Treatment Inquiry */}

              <motion.div

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.35 }}

              >

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">

                  <Stethoscope className="w-4 h-4 text-slate-400" />

                  Procedure / Treatment Inquiry <span className="text-red-500">*</span>

                </label>

                <textarea

                  name="procedure"

                  value={formData.procedure}

                  onChange={handleChange}

                  placeholder="Please describe the procedure or treatment you're interested in..."

                  rows={3}

                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all resize-none ${

                    errors.procedure ? 'border-red-300 bg-red-50' : 'border-slate-200'

                  }`}

                />

                {errors.procedure && <p className="text-red-500 text-xs mt-1">{errors.procedure}</p>}

              </motion.div>

 

              {/* Where did you hear about us */}

              <motion.div

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.4 }}

              >

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">

                  <Radio className="w-4 h-4 text-slate-400" />

                  Where did you hear about us? <span className="text-red-500">*</span>

                </label>

                <div className="grid grid-cols-2 gap-2">

                  {HEARD_FROM_OPTIONS.map((option, idx) => (

                    <motion.label

                      key={option}

                      initial={{ opacity: 0, scale: 0.9 }}

                      animate={{ opacity: 1, scale: 1 }}

                      transition={{ delay: 0.4 + idx * 0.03 }}

                      whileHover={{ scale: 1.02 }}

                      whileTap={{ scale: 0.98 }}

                      className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer transition-all text-sm ${

                        formData.heardFrom === option

                          ? 'border-slate-900 bg-slate-900 text-white'

                          : 'border-slate-200 hover:border-slate-300'

                      }`}

                    >

                      <input

                        type="radio"

                        name="heardFrom"

                        value={option}

                        checked={formData.heardFrom === option}

                        onChange={handleChange}

                        className="sr-only"

                      />

                      {option}

                    </motion.label>

                  ))}

                </div>

                {errors.heardFrom && <p className="text-red-500 text-xs mt-1">{errors.heardFrom}</p>}

              </motion.div>

 

              {/* Submit Button */}

              <motion.button

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.45 }}

                whileHover={{ scale: 1.01 }}

                whileTap={{ scale: 0.99 }}

                type="submit"

                className="w-full bg-[#1C1C1C] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-black transition-colors shadow-lg shadow-slate-900/10 mt-6"

              >

                Submit Inquiry

              </motion.button>

 

              <motion.p

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

                transition={{ delay: 0.5 }}

                className="text-xs text-center text-slate-400 mt-4"

              >

                By submitting, you agree to be contacted by our care team via WhatsApp

              </motion.p>

            </form>

          </motion.div>

        </div>

      )}

    </AnimatePresence>

  );

};
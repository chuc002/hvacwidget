import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Phone, Globe, MapPin } from 'lucide-react';
import WizardLayout from './WizardLayout';

const businessInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Please select your industry"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  address: z.string().min(1, "Business address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Please enter a valid ZIP code"),
  description: z.string().optional(),
});

type BusinessInfoForm = z.infer<typeof businessInfoSchema>;

interface BusinessInfoStepProps {
  onNext: (data: BusinessInfoForm) => void;
  onBack: () => void;
  isLoading?: boolean;
  initialData?: Partial<BusinessInfoForm>;
}

export default function BusinessInfoStep({ 
  onNext, 
  onBack, 
  isLoading = false,
  initialData = {}
}: BusinessInfoStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<BusinessInfoForm>({
    resolver: zodResolver(businessInfoSchema),
    mode: 'onChange',
    defaultValues: initialData
  });

  const selectedIndustry = watch('industry');

  const industries = [
    { value: 'hvac', label: 'HVAC & Air Conditioning' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'pest-control', label: 'Pest Control' },
    { value: 'lawn-care', label: 'Lawn Care & Landscaping' },
    { value: 'pool-service', label: 'Pool Maintenance' },
    { value: 'cleaning', label: 'Cleaning Services' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'appliance-repair', label: 'Appliance Repair' },
    { value: 'handyman', label: 'Handyman Services' },
    { value: 'other', label: 'Other Home Services' },
  ];

  const onSubmit = (data: BusinessInfoForm) => {
    onNext(data);
  };

  return (
    <WizardLayout
      currentStep={2}
      totalSteps={5}
      stepTitle="Tell Us About Your Business"
      stepDescription="Help us customize ServicePlan Pro for your home service company"
      onNext={handleSubmit(onSubmit)}
      onBack={onBack}
      nextLabel="Continue"
      nextDisabled={!isValid}
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Let's set up your business profile
          </h2>
          <p className="text-gray-600">
            This information helps us tailor your subscription widgets to your specific services
          </p>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="e.g., ABC HVAC Services"
              {...register('companyName')}
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && (
              <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={selectedIndustry}
              onValueChange={(value) => setValue('industry', value, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-red-600 mt-1">{errors.industry.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Business Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                {...register('phone')}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="website"
                placeholder="https://www.yourcompany.com"
                className={`pl-10 ${errors.website ? "border-red-500" : ""}`}
                {...register('website')}
              />
            </div>
            {errors.website && (
              <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
            )}
          </div>
        </div>

        {/* Business Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Business Address</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                {...register('address')}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Your City"
                {...register('city')}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                placeholder="State"
                {...register('state')}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                placeholder="12345"
                {...register('zipCode')}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && (
                <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Description */}
        <div>
          <Label htmlFor="description">Brief Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Tell us a bit about your services and what makes your business unique..."
            rows={3}
            {...register('description')}
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps us suggest better maintenance plan templates for your industry
          </p>
        </div>

        {/* Benefits Preview */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">What happens next:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• We'll customize widget templates for your industry</li>
            <li>• Your company branding will be applied automatically</li>
            <li>• Service area and contact info will be pre-filled</li>
          </ul>
        </div>
      </form>
    </WizardLayout>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Mail, AlertCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { toast } from 'sonner';
import { buildConsultWhatsAppLink } from '../utils/consultWhatsAppLink';
import { buildConsultExpertMailto } from '../utils/consultExpertMailto';
import { isConsultationFormValid, isValidEmail } from '../utils/consultationValidation';

type ConsultationType = 'academic' | 'crop' | 'industrial' | '';

export default function ConsultationPage() {
  const [consultationType, setConsultationType] = useState<ConsultationType>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Strict boolean validation for form gating
  const isFormValid: boolean = isConsultationFormValid({
    consultationType,
    name,
    email,
    message,
  });

  const getConsultationTypeLabel = (type: ConsultationType): string => {
    switch (type) {
      case 'academic':
        return 'Academic Support';
      case 'crop':
        return 'Crop Support';
      case 'industrial':
        return 'Industrial Support';
      default:
        return '';
    }
  };

  const handleWhatsAppClick = () => {
    if (!isFormValid) return;

    const typeLabel = getConsultationTypeLabel(consultationType);
    const whatsappUrl = buildConsultWhatsAppLink({
      consultationType: typeLabel,
      name,
      email,
      message,
    });

    const newWindow = window.open(whatsappUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      toast.error('Unable to open WhatsApp. Please check your browser settings or try again.');
    } else {
      toast.success('Opening WhatsApp...');
    }
  };

  const handleMailClick = () => {
    if (!isFormValid) return;

    const typeLabel = getConsultationTypeLabel(consultationType);
    const mailtoUrl = buildConsultExpertMailto({
      consultationType: typeLabel,
      name,
      email,
      message,
    });

    window.location.href = mailtoUrl;
    toast.success('Opening your email client...');
  };

  return (
    <div className="container py-12 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Consult an Expert</h1>
        <p className="text-lg text-muted-foreground">
          Get professional guidance from our team of agricultural experts
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Consultation Request Form
          </CardTitle>
          <CardDescription>
            Fill in your details and select the type of consultation you need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consultation Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="consultation-type">Consultation Type *</Label>
            <Select value={consultationType} onValueChange={(value) => setConsultationType(value as ConsultationType)}>
              <SelectTrigger id="consultation-type">
                <SelectValue placeholder="Select consultation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic Support</SelectItem>
                <SelectItem value="crop">Crop Support</SelectItem>
                <SelectItem value="industrial">Industrial Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email && !isValidEmail(email) && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <Label htmlFor="message">Describe here *</Label>
            <Textarea
              id="message"
              placeholder="Please describe your inquiry or consultation needs in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleWhatsAppClick}
              disabled={!isFormValid}
              className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white"
              size="lg"
            >
              <SiWhatsapp className="h-5 w-5 mr-2" />
              WhatsApp Us
            </Button>
            <Button
              onClick={handleMailClick}
              disabled={!isFormValid}
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/10"
              size="lg"
            >
              <Mail className="h-5 w-5 mr-2" />
              Mail Us
            </Button>
          </div>

          {/* Helper Text */}
          {!isFormValid && (
            <p className="text-sm text-muted-foreground text-center">
              Please fill in all required fields to continue
            </p>
          )}
        </CardContent>
      </Card>

      {/* Charges Disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          * Charges may vary based on consultation type
        </p>
      </div>
    </div>
  );
}

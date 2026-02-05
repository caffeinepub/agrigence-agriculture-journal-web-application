import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, Send, Users, Target } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

export default function AboutContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container py-12">
      <div className="mb-12 text-center animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">About Us & Contact</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn more about Agrigence and get in touch with us
        </p>
      </div>

      <div className="grid gap-12 max-w-6xl mx-auto">
        <section className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Agrigence is dedicated to advancing agricultural education and research by providing a comprehensive
                platform for researchers, students, and professionals to share knowledge and collaborate on innovative
                solutions for the agricultural sector.
              </p>
              <p className="text-muted-foreground">
                We believe in the power of shared knowledge to transform agriculture and create sustainable solutions
                for the future. Our platform facilitates the publication and dissemination of high-quality research
                articles, making agricultural knowledge accessible to everyone.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Our Founders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center hover:scale-105 transition-transform">
                  <div className="mb-4 flex justify-center">
                    <img
                      src="/assets/20220525_111130_600-removebg-preview.png"
                      alt="Sarvesh Kumar Yadav"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sarvesh Kumar Yadav</h3>
                  <p className="text-primary font-medium mb-2">Founder</p>
                  <p className="text-sm text-muted-foreground">
                    Visionary leader committed to revolutionizing agricultural research and education through
                    technology and innovation.
                  </p>
                </div>
                <div className="text-center hover:scale-105 transition-transform">
                  <div className="mb-4 flex justify-center">
                    <img
                      src="/assets/generated/scientist-portrait-2.dim_200x200.jpg"
                      alt="Shivi Jaiswal"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Shivi Jaiswal</h3>
                  <p className="text-primary font-medium mb-2">Co-Founder</p>
                  <p className="text-sm text-muted-foreground">
                    Passionate about creating accessible platforms for knowledge sharing and fostering collaboration
                    in the agricultural community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-sm text-muted-foreground">+91 9452571317</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <SiWhatsapp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/919452571317"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      +91 9452571317
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">agrigence@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

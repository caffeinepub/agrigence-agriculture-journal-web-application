import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetEditorialBoardMembers } from '../hooks/useQueries';
import { Mail, Phone, GraduationCap, Briefcase, MapPin } from 'lucide-react';

export default function EditorialBoardPage() {
  const { data: members, isLoading } = useGetEditorialBoardMembers();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getImageUrl = (member: any) => {
    // If blob exists, use it
    if (member.blob) {
      return member.blob.getDirectURL();
    }
    // Otherwise use placeholder
    return '/assets/generated/editorial-member-placeholder.dim_200x200.png';
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Editorial Board</h1>
        <p className="text-lg text-muted-foreground">
          Our distinguished editorial board comprises leading experts in agricultural sciences, dedicated to maintaining
          the highest standards of academic excellence and integrity. Each member brings extensive research experience
          and expertise to guide the peer-review process and ensure the quality of published research.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading editorial board members...</p>
        </div>
      ) : members && members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id.toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={getImageUrl(member)} alt={member.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <Badge variant="secondary" className="mx-auto mt-2">
                  {member.role}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-muted-foreground">Qualification</p>
                    <p>{member.qualification}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-muted-foreground">Expertise</p>
                    <p>{member.expertise}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-muted-foreground">Location</p>
                    <p className="text-xs">Zura Haradhan, Chandauli, Uttar Pradesh, 221115</p>
                  </div>
                </div>
                {member.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <a href={`mailto:${member.email}`} className="text-primary hover:underline break-all">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <a href={`tel:${member.phone}`} className="text-primary hover:underline">
                      {member.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No editorial board members available at the moment. Please check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

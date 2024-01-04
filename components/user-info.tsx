import { ExtendedUser } from "~/next-auth";
import { Card, CardHeader } from "~/components/ui/card";

interface IProps {
  user?: ExtendedUser;
  label: string;
}

export function UserInfo({ user, label }: IProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-center text-2xl font-semibold">{label}</p>
      </CardHeader>
    </Card>
  );
}

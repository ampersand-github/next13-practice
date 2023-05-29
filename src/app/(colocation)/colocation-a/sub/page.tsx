import {
  PartsA1,
  PartsA2,
  PartsA3,
} from "@/app/(colocation)/colocation-a/_components";
import { Button } from "@/app/_components/ui/button";

export default async function Page() {
  return (
    <div>
      <h1>Co-location A sub</h1>
      <PartsA1 />
      <PartsA2 />
      <PartsA3 />
      <Button />
    </div>
  );
}

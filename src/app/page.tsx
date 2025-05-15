import AppLayout from "@/components/layout/app-layout";
import { DndProviderWrapper } from "@/components/providers/dnd-provider";

export default function Home() {
  return (
    <DndProviderWrapper>
      <AppLayout />
    </DndProviderWrapper>
  );
}

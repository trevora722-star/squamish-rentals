import { Header } from "@/components/site/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";

export const metadata = {
  title: "Chat with our booking assistant",
  description:
    "Talk to our chat assistant to get a quote, check availability, and book your ATV rental end-to-end.",
};

interface SearchParams {
  atv?: string;
  action?: string;
  route?: string;
  booking?: string;
  cancelled?: string;
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        <div className="border-b border-border bg-card">
          <div className="container-x mx-auto max-w-2xl py-5">
            <h1 className="text-2xl font-display">Booking assistant</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quotes, availability, and bookings handled in chat. The hold on a
              new booking lasts 15 minutes once it's created.
            </p>
          </div>
        </div>
        <ChatInterface seedParams={sp} />
      </div>
    </>
  );
}

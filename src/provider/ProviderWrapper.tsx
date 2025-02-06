// import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { UserContextProvider } from "@/provider/UserContextProvider";

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (

      <UserContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </UserContextProvider>
    
  );
}

import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SnackbarProvider autoHideDuration={1500} preventDuplicate anchorOrigin={{
			vertical: "bottom",
			horizontal: "right"
		}}>
			<ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
			<Component {...pageProps} />
		  </ThemeProvider>
		</SnackbarProvider>
	);
}

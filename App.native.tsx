
import { StyleSheet, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './client/src/App';
import { queryClient } from './client/src/lib/queryClient';
import { ThemeProvider } from './client/src/hooks/use-theme';

export default function NativeApp() {
  return (
    <View style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

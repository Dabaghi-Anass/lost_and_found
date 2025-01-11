import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RealOwnerSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams();
  const theme = useColorScheme();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const result = {
        found: true,
        ownerName: 'John Doe',
      }
      if (result.found) {
        Alert.alert('Success', `Real owner found: ${result.ownerName}`);
      } else {
        Alert.alert('Not Found', 'No matching owner found. Please try a different search.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>
        Find the Real Owner
      </Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
          placeholder="Enter owner's name or details"
          placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={[styles.searchButton, { opacity: loading ? 0.7 : 1 }]}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <Feather name="loader" size={24} color="#fff" />
          ) : (
            <Feather name="search" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={[styles.hint, { color: theme === 'dark' ? '#ccc' : '#666' }]}>
        Enter any information that might help identify the real owner, such as name, contact details, or item description.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
  },
});


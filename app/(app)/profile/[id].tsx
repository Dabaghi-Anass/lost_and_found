import { fetchUserById } from '@/api/database';
import ItemMinifiedCard from '@/components/item-minified-card';
import { useStorageState } from '@/hooks/useStorageState';
import { AppUser } from '@/types/entities.types';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<AppUser | null>(null);
  const [storedId, setStoredId] = useStorageState('userId', '');

  const handleMessage = () => {
    console.log('Message user:', user?.profile.id);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${user?.profile.firstName.toLowerCase()}.${user?.profile.lastName.toLowerCase()}@example.com`);
  };

  async function getUserById(id: string) {
    const user = await fetchUserById(id);
    if (!user) return;
    setUser(user);
  }
  useEffect(() => {
    console.log({ storedId })
    if (id) {
      getUserById(id as string);
    } else if (!id) {
      getUserById(storedId);
    }
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user?.profile.imageUri }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{user?.profile.firstName} {user?.profile.lastName}</Text>
        {user?.role &&
          <Text
            style={styles.role}
          >{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} • {user?.items.length} items
          </Text>
        }

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.messageButton]} onPress={handleMessage}>
            <Feather name="message-square" size={20} color="white" />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={handleEmail}>
            <Feather name="mail" size={20} color="white" />
            <Text style={styles.buttonText}>Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <Feather name="mail" size={16} color="#666" />
            <Text style={styles.contactText}>{user?.profile.firstName.toLowerCase()}.{user?.profile.lastName.toLowerCase()}@example.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({user?.items.length})</Text>
          {user?.items.map((item) => (
            <ItemMinifiedCard
              key={item.id}
              item={item}
              onPress={() => {
                router.push(`/item-details/${item.id}`);
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 200,
    backgroundColor: '#4a90e295',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: 70,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -50,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
  },
  messageButton: {
    backgroundColor: '#4a90e2',
  },
  emailButton: {
    backgroundColor: '#50c878',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});


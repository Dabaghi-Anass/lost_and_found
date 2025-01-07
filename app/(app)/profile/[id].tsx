import { logoutUser } from '@/api/auth';
import { fetchUserById } from '@/api/database';
import { AppButton } from '@/components/AppButton';
import { ConfirmationModal } from '@/components/confirmation-modal';
import ItemMinifiedCard from '@/components/item-minified-card';
import { AppUser } from '@/types/entities.types';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<AppUser | null>(null);
  const currentUser = useSelector((state: any) => state.user);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  function openConfirmationModal() {
    setConfirmationModalVisible(true);
  }
  const handleMessage = () => {
    console.log('Message user:', user?.profile.id);
  };
  const handleLogout = () => {
    logoutUser().then(() => {
      router.replace('/login');
    })
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
    (async () => {
      if (id) {
        getUserById(id as string);
      } else if (!id) {
        setUser(currentUser);
      }
    })()
  }, [id]);

  if (!user) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
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
            <Text style={styles.contactText}>{user.email}</Text>
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
      {currentUser.id === user.id &&
        <View className='flex flex-row items-center justify-center py-8 px-4 gap-4'>
          <AppButton variant="outline" className='gap-4'>
            <Text className='text-foreground text-xl'>edit profile</Text>
            <FontAwesome5 name="user-edit" size={20} color="#444" />
          </AppButton>
          <ConfirmationModal
            title='Logout'
            description='Are you sure you want to logout?'
            trigger={<AppButton variant="destructive" className='gap-4' onPress={openConfirmationModal}>
              <Text className='text-white text-xl'>logout</Text>
              <AntDesign name="logout" size={20} color="white" />
            </AppButton>}
            open={confirmationModalVisible}
            onAccept={() => {
              handleLogout();
            }}
            onClose={() => {
              setConfirmationModalVisible(false);
            }}
          />
        </View>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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


import { fetchAllItems } from "@/api/database";
import ItemCard from "@/components/item-card";
import { useSearch } from "@/hooks/use-search";
import { Item } from "@/types/entities.types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const LostItemPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filtredItems = useSearch(items, searchQuery);
  const router = useRouter()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await fetchAllItems();
        setItems(fetchedItems);
      } catch (err) {
        setError("Failed to fetch items.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);



  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3182CE" />
        <Text>Loading items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {filtredItems.map((item, index) => (<ItemCard key={index}
          item={item}
          onViewDetails={(_) => {
            console.log(JSON.stringify(item, null, 2));
            router.push("/(app)/item-details/" + item.id as any)
          }}
          onViewProfile={(_) => { }} />))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  content: {
    alignItems: "center",
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginVertical: 10,
    width: "100%",
    maxWidth: 400,
  },
  imageContainer: {
    // width: '100%',
    // height: 200,
    //borderRadius: 10,
    //marginBottom: 16,
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,

    shadowRadius: 5,
    elevation: 5,
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  overlayBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 10,
  },
  deliveredBadge: {
    backgroundColor: "#48BB78",
  },
  notDeliveredBadge: {
    backgroundColor: "#F56565",
  },
  overlayText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2070F0',
    marginBottom: 16,
    paddingInline: 14,
    paddingVertical: 10,
  },
  description: {
    fontSize: 15,
    color: '#4A5568',
    marginBottom: 16,
    paddingInline: 14,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingInline: 14,
  },
  detailText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
  },
  date: {
    fontSize: 15,
    color: '#404040',
    paddingInline: 14,
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',

    marginVertical: 10,
    paddingHorizontal: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#5A67D8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 14,
    paddingInline: 14,
  },
  link: {
    fontSize: 14,
    color: '#5A67D8',
    fontWeight: 'bold',
    paddingVertical: 14,
    paddingInline: 14,
  },
  searchBar: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingInline: 14,
  },
  categoryText: {

    color: '#39FF14',
    fontSize: 14,
    fontWeight: '500',
  },
  colorText: {

    color: '#FF1439',
    fontSize: 14,
    fontWeight: '500',
  },
  spacer: {
    width: 110,
  },
  blueText: {
    color: '#3182CE',
    fontSize: 15,

  },
  purpleText: {
    color: '#805AD5',
    fontSize: 15,
  }
});

export default LostItemPage;

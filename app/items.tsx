import { AppButton } from "@/components/AppButton";
import { DetectedInstalledAppModal } from "@/components/detected-app-modal";
import { DownloadAppModal } from "@/components/download-app-modal";
import { Input } from "@/components/Input";
import ItemCard from "@/components/item-card";
import ItemMinifiedCard from "@/components/item-minified-card";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/use-search";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFetchAll } from "@/hooks/useFetch";
import { usePushScreen } from "@/hooks/usePushScreen";
import { FirebaseCollections } from "@/lib/constants";
import { getCategories, isAppInstalled } from "@/lib/utils";
import { setCurrentScreenName } from "@/redux/global/currentScreenName";
import { setItems } from "@/redux/global/items";
import { Item } from "@/types/entities.types";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { UrlContext } from "./_layout";

const LostItemPage: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const theme = useColorScheme();
  usePushScreen("items")
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowDownloadAppModalState] = useState(false);
  const [showModalAppInstalled, setShowModalAppInstalledState] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const currentUser = useSelector((state: any) => state.user);
  const itemsFromStore: Record<string, Item> = useSelector((state: any) => state.items);
  const path = useContext(UrlContext);
  const { data, error, loading, refetch } = useFetchAll<Item>({
    collection: FirebaseCollections.LOST_ITEMS,
    cachedData: [...Object.values(itemsFromStore)],
    cache: (data) => {
      dispatch(setItems(data as any))
    },
    recursivefetchers: [
      {
        collectionName: FirebaseCollections.ITEMS,
        idPropertyName: "item",
        propertyName: "item"
      },
      {
        collectionName: FirebaseCollections.PROFILES,
        idPropertyName: "ownerId",
        propertyName: "owner"
      },
    ],
    convertersMap: {
      found_lost_at: (value: any) => value.seconds * 1000,
      deliveredAt: (value: any) => (value?.seconds || 0) * 1000,
    }
  });
  const items = useSearch(data, searchQuery).filter((item: Item) => selectedCategory === "all" || item?.item?.category === selectedCategory)

  function setShowDownloadAppModal(value: boolean) {
    if (Platform.OS !== "web") return
    const hide = localStorage.getItem('hideDownloadAppModal');
    if (hide === 'true') return;
    setShowDownloadAppModalState(value)
  }
  function setShowModalAppInstalled(value: boolean) {
    if (Platform.OS !== "web") return
    const hide = localStorage.getItem('hideDownloadAppModal');
    if (hide === 'true') return;
    setShowModalAppInstalledState(value)
  }
  const initInstallApp = async () => {
    if (!path) return;
    if (path && Platform.OS === "web") {
      const hasApp = await isAppInstalled(path);
      if (hasApp) {
        setShowModalAppInstalled(true)
      } else {
        setShowDownloadAppModal(true)
      }
    } else if (path && Platform.OS !== "web") {
      router.navigate(`/${path}` as any)
    }
    else if (!path) {
      setShowDownloadAppModal(true)
    }

  }

  useEffect(() => {
    initInstallApp()
  }, [])
  useFocusEffect(useCallback(() => {
    refetch()
  }, [[...Object.values(itemsFromStore)].length]))
  const changeScreenName = useCallback(() => {
    dispatch(setCurrentScreenName('lost items'));
  }, []);
  useFocusEffect(changeScreenName);
  useFocusEffect(useCallback(() => {
    if (currentUser === null || Object.keys(currentUser).length === 0) router.push("/login");
  }, [currentUser]))
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-2 bg-background items-start justify-start">
      <SEO />
      {Platform.OS === "web" &&
        <>
          <DownloadAppModal visible={showModal} onClose={() => setShowDownloadAppModal(false)} />
          <DetectedInstalledAppModal visible={showModalAppInstalled} onClose={() => setShowModalAppInstalled(false)} />
        </>
      }
      <View className="w-full gap-2 flex-row items-center">
        <Input
          placeholder="Search by title, category, color, owner name, anything..."
          placeholderTextColor={theme === "dark" ? "#ddd" : "#444"}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="my-4 text-foreground md:web:max-w-[500px] web:min-w-[80%] md:web:min-w-[500px]"
          style={{
            color: theme === "dark" ? "#ddd" : "#444",
          }}
          inputClasses="rounded-full"
        />
        <AppButton size="icon" variant="secondary" className="rounded-full" onPress={refetch}>
          <AntDesign name="reload1" size={24} color={theme === "dark" ? "white" : "#222"} />
        </AppButton>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="w-full">
        <View className="pb-4 mb-4 gap-2 flex-row items-center justify-center h-16">
          {getCategories().map((category) => (
            <Pressable onPress={() => setSelectedCategory(category.toLowerCase())} key={category}>
              <Badge className={`h-8 items-center justify-center ${selectedCategory === category.toLowerCase() ? "bg-primary" : "bg-background border border-input"}`}>
                <Text
                  onPress={() => setSelectedCategory(category.toLowerCase())}
                  className={selectedCategory === category.toLowerCase() ? "text-white" : "text-foreground"}>
                  {category}
                </Text>
              </Badge>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <FlatList
        refreshing={loading}
        onRefresh={refetch}
        ListHeaderComponent={() => (
          <View className="px-2 gap-4 web:w-screen">
            <Text className="text-2xl text-foreground text-semibold capitalize">last added items</Text>
            <FlatList
              ListEmptyComponent={() => (
                <View style={styles.centered}>
                  <Text className="text-foreground">No items found.</Text>
                </View>
              )}

              scrollEnabled={true}
              horizontal={true}
              showsHorizontalScrollIndicator={Platform.OS === "web"}
              data={data?.sort((a: any, b: any) => b.found_lost_at - a.found_lost_at).slice(0, 15)}
              renderItem={({ item }) => (<ItemMinifiedCard item={item} />)}
              keyExtractor={(item) => item.id as string}
              contentContainerClassName="gap-4 py-2"
              className="pr-4"
            />
            <Text className="text-2xl text-foreground text-semibold capitalize">From Most Popular Users</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="w-full h-full items-center justify-center">
            <Text className="text-foreground text-4xl">No items found.</Text>
          </View>
        )}
        scrollEnabled={true}
        showsVerticalScrollIndicator

        data={items}
        renderItem={({ item }) => (<ItemCard
          item={item}
          onViewDetails={(_) => {
            router.navigate("/item-details/" + item.id as any)
          }}
          onViewProfile={(id) => {
            router.navigate("/profile/" + id as any)
          }} />)}
        keyExtractor={(item) => item.id as string}
        className="w-full h-full"
        contentContainerClassName="w-full pb-8 web:flex-row items-container web:flex-wrap gap-4 web:items-start md:web:mx-4"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

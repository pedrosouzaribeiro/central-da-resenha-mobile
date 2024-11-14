import React, { useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import Header from '../../components/header'
import Footer from '../../components/footer'

const { width, height } = Dimensions.get('window')

const menuItems = [
  { icon: 'soccer-field', title: 'Reservar um campo', description: 'Reserve um horário no seu campo favorito.', route: 'Fields' },
  { icon: 'cart-outline', title: 'Compras para o churras', description: 'Encontre os melhores preços da região.', route: 'Shopping' },
  { icon: 'account-group', title: 'Organizar um time', description: 'Reúna os times para aquele fut.', route: 'Teams' },
  { icon: 'account-plus-outline', title: 'Adicionar um amigo', description: 'Convide amigos para jogos.', route: 'AddFriend' },
]

export default function MenuScreen() {
  const navigation = useNavigation()
  const scrollY = useRef(new Animated.Value(0)).current

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const renderMenuItem = ({ icon, title, description, route }, index) => {
    const translateY = scrollY.interpolate({
      inputRange: [0, 50 * index, 50 * (index + 2)],
      outputRange: [0, 0, 50],
      extrapolate: 'clamp',
    })

    return (
      <Animated.View key={index} style={[styles.menuItem, { transform: [{ translateY }] }]}>
        <TouchableOpacity
          style={styles.menuItemContent}
          onPress={() => navigation.navigate(route)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name={icon} size={32} color="#4ECB71" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>{title}</Text>
            <Text style={styles.menuItemDescription}>{description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#4ECB71" />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <Header />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Text style={styles.title}>O que você quer fazer hoje?</Text>
        {menuItems.map(renderMenuItem)}

        <View style={styles.contactSection}>
          <Text style={styles.contactText}>Fale com a equipe da Central</Text>
          <TouchableOpacity>
            <Text style={styles.contactHandle}>@centraldaresenha</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  menuItem: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#131313',
    shadowColor: '#4ECB71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  contactSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  contactHandle: {
    fontSize: 16,
    color: '#4ECB71',
    fontWeight: 'bold',
  },
})
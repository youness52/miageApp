import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation, route }) {
  const [student, setStudent] = useState(route.params?.student);

  useEffect(() => {
    const loadStudent = async () => {
      if (!student) {
        const stored = await AsyncStorage.getItem('student');
        if (stored) setStudent(JSON.parse(stored));
      }
    };
    loadStudent();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('student');
    navigation.replace('Login');
  };

  if (!student) {
    return (
      <View style={styles.container}>
        <Text>Chargement des données...</Text>
      </View>
    );
  }
console.log('Loaded student:', student);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://images2.imgbox.com/21/4c/VzXqdwi7_o.png' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{student.name}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.info}><Text style={styles.label}>ID Scolaire:</Text> {student.school_id}</Text>
          <Text style={styles.info}><Text style={styles.label}>Date de Naissance:</Text> {student.date_of_birth}</Text>
          <Text style={styles.info}><Text style={styles.label}>Classe:</Text> {student.class}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UploadProject')}>
            <Text style={styles.buttonText}>📤 Déposer un Projet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Projets')}>
            <Text style={styles.buttonText}>📁 Voir les Projets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notes')}>
            <Text style={styles.buttonText}>📊 Voir les Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostsScreen')}>
            <Text style={styles.buttonText}>📆 Voir les Absences</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
            <Text style={styles.buttonText}>🚪 Se Déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 15,
  },
  infoBox: {
    width: '100%',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

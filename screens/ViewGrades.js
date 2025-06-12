import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.apiUrl+"api/grades.php";

export default function ViewGrades() {
  const [grades, setGrades] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const fetchGrades = async () => {
    try {
      const storedStudent = await AsyncStorage.getItem('student');
      if (!storedStudent) return;

      const studentData = JSON.parse(storedStudent);
      setStudent(studentData);

      const response = await fetch(`${API_URL}?student_id=${studentData.id}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setGrades(result.notes);
      }
    } catch (error) {
      console.error('Erreur de chargement des notes :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
    
      {grades.length > 0 ? (
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.cellModule]}>Module</Text>
            <Text style={[styles.cell, styles.cell25]}>MP</Text>
            <Text style={[styles.cell, styles.cell25]}>MG</Text>
          </View>

          {/* Table Rows */}
          {grades.map((note, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                style={[styles.dataRow, expandedIndex === index && styles.rowExpanded]}
                activeOpacity={0.7}
              >
                <Text style={[styles.cell, styles.cellModule]}>{note.nom_module}</Text>
                <Text style={[styles.cell, styles.cell25]}>{note.mp}</Text>
                <Text style={[styles.cell, styles.cell25]}>{note.mg}</Text>
              </TouchableOpacity>

              {expandedIndex === index && (
                <View style={styles.expanded}>
                  {[1, 2, 3, 4].map((num) => {
                    const ccValue = note[`cc${num}`];
                    if (ccValue == null) return null;
                    return (
                      <Text key={num} style={styles.detail}>
                        <Text style={styles.label}>CC{num}:</Text> {ccValue}
                      </Text>
                    );
                  })}
                  <Text style={styles.detail}>
                    <Text style={styles.label}>Exam Théorique:</Text> {note.exam_theo}
                  </Text>
                  <Text style={styles.detail}>
                    <Text style={styles.label}>Exam Pratique:</Text> {note.exam_prati}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noData}>Aucune note disponible.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#007bff',
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 10,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 12,
  },
  rowExpanded: {
    backgroundColor: '#e6f0ff',
  },
  cell: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  cellModule: {
    flex: 2,  // 50% (flex:2 out of total flex:4)
    fontWeight: '600',
    textAlign: 'left',
    paddingLeft: 10,
  },
  cell25: {
    flex: 1,  // 25%
  },
  expanded: {
    backgroundColor: '#d9e8ff',
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 6,
  },
  detail: {
    fontSize: 11,
    marginVertical: 2,
    color: '#222',
  },
  label: {
    fontWeight: '700',
    color: '#0056b3',
  },
  noData: {
    marginTop: 20,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
});

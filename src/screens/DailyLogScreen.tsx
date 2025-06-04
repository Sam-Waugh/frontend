import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, DailyLogForm } from '../models';
import { useAppDispatch, useAppSelector } from '../store';
import { createLog } from '../store/slices/logsSlice';

type DailyLogRouteProp = RouteProp<RootStackParamList, 'DailyLog'>;

export default function DailyLogScreen() {
  const route = useRoute<DailyLogRouteProp>();
  const dispatch = useAppDispatch();
  const { selectedChild } = useAppSelector((state) => state.children);
  
  const [logData, setLogData] = useState<DailyLogForm>({
    symptoms: {
      rash: 0,
      cough: 0,
      runnyNose: 0,
      itching: 0,
      wheezing: 0,
    },
    mood: 3,
    triggers: [],
    notes: '',
  });

  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const commonTriggers = [
    'Pollen', 'Dust', 'Pet dander', 'Food', 'Weather', 'Stress',
    'Exercise', 'Chemicals', 'Smoke', 'Perfume'
  ];

  const handleSymptomChange = (symptom: keyof typeof logData.symptoms, value: number) => {
    setLogData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: value,
      },
    }));
  };

  const toggleTrigger = (trigger: string) => {
    const newTriggers = selectedTriggers.includes(trigger)
      ? selectedTriggers.filter(t => t !== trigger)
      : [...selectedTriggers, trigger];
    
    setSelectedTriggers(newTriggers);
    setLogData(prev => ({ ...prev, triggers: newTriggers }));
  };

  const handleSubmit = () => {
    if (!selectedChild) {
      Alert.alert('Error', 'Please select a child first');
      return;
    }

    dispatch(createLog({
      childId: selectedChild.id,
      logData,
    }));

    Alert.alert('Success', 'Daily log saved successfully!');
    
    // Reset form
    setLogData({
      symptoms: {
        rash: 0,
        cough: 0,
        runnyNose: 0,
        itching: 0,
        wheezing: 0,
      },
      mood: 3,
      triggers: [],
      notes: '',
    });
    setSelectedTriggers([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Health Log</Text>
          <Text style={styles.headerSubtitle}>
            {selectedChild ? `For ${selectedChild.name}` : 'Select a child'}
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Symptoms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms (0-10 scale)</Text>
          
          {Object.entries(logData.symptoms).map(([symptom, value]) => (
            <View key={symptom} style={styles.symptomRow}>
              <Text style={styles.symptomLabel}>
                {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              <View style={styles.scaleContainer}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.scaleButton,
                      value === num && styles.selectedScaleButton,
                    ]}
                    onPress={() => handleSymptomChange(symptom as keyof typeof logData.symptoms, num)}
                  >
                    <Text
                      style={[
                        styles.scaleButtonText,
                        value === num && styles.selectedScaleButtonText,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Mood Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood (1-5 scale)</Text>
          <View style={styles.moodContainer}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.moodButton,
                  logData.mood === num && styles.selectedMoodButton,
                ]}
                onPress={() => setLogData(prev => ({ ...prev, mood: num }))}
              >
                <Text style={styles.moodEmoji}>
                  {num === 1 ? '😢' : num === 2 ? '😞' : num === 3 ? '😐' : num === 4 ? '😊' : '😄'}
                </Text>
                <Text style={styles.moodNumber}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Triggers Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Potential Triggers</Text>
          <View style={styles.triggersContainer}>
            {commonTriggers.map((trigger) => (
              <TouchableOpacity
                key={trigger}
                style={[
                  styles.triggerButton,
                  selectedTriggers.includes(trigger) && styles.selectedTriggerButton,
                ]}
                onPress={() => toggleTrigger(trigger)}
              >
                <Text
                  style={[
                    styles.triggerButtonText,
                    selectedTriggers.includes(trigger) && styles.selectedTriggerButtonText,
                  ]}
                >
                  {trigger}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="Add any additional notes about today's symptoms, activities, or observations..."
            value={logData.notes}
            onChangeText={(text) => setLogData(prev => ({ ...prev, notes: text }))}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Daily Log</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  symptomRow: {
    marginBottom: 16,
  },
  symptomLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedScaleButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  scaleButtonText: {
    fontSize: 12,
    color: '#333',
  },
  selectedScaleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMoodButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  triggersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  triggerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedTriggerButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  triggerButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTriggerButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { loadDummyData } from '../store/slices/childrenSlice';
import { loadDummyLogs } from '../store/slices/logsSlice';
import { fetchCurrentWeather } from '../store/slices/environmentSlice';

// Helper function to get pollen level color
const getPollenColor = (category: string): string => {
  switch (category.toUpperCase()) {
    case 'NONE':
    case 'VERY_LOW':
      return '#4CAF50'; // Green
    case 'LOW':
      return '#8BC34A'; // Light Green
    case 'MODERATE':
      return '#FFC107'; // Yellow
    case 'HIGH':
      return '#FF9800'; // Orange
    case 'VERY_HIGH':
      return '#F44336'; // Red
    default:
      return '#9E9E9E'; // Gray
  }
};

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { selectedChild, children } = useAppSelector((state) => state.children);
  const { logs } = useAppSelector((state) => state.logs);
  const { currentWeather } = useAppSelector((state) => state.environment);

  useEffect(() => {
    // Load dummy data for UI prototyping
    dispatch(loadDummyData());
    dispatch(loadDummyLogs());
    dispatch(fetchCurrentWeather('New York, NY'));
  }, [dispatch]);

  const recentLogs = logs.slice(0, 3);
  const todayLog = logs.find(log => {
    const today = new Date().toISOString().split('T')[0];
    return log.date === today;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Allergy Tracker</Text>
          <Text style={styles.headerSubtitle}>
            {selectedChild ? `Tracking ${selectedChild.name}` : 'Select a child'}
          </Text>
        </View>

        {/* Child Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={[
                  styles.childCard,
                  selectedChild?.id === child.id && styles.selectedChildCard,
                ]}
              >
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childAge}>
                  Age {new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Today's Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Status</Text>
          {todayLog ? (
            <View style={styles.statusCard}>
              <Text style={styles.statusText}>Log completed for today</Text>
              <View style={styles.symptomsRow}>
                <Text>Rash: {todayLog.symptoms.rash}/10</Text>
                <Text>Cough: {todayLog.symptoms.cough}/10</Text>
                <Text>Mood: {todayLog.mood}/5</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.statusCard}>
              <Text style={styles.statusTextIncomplete}>No log for today</Text>
              <Text style={styles.statusSubtext}>Tap to add daily log</Text>
            </TouchableOpacity>
          )}
        </View>        {/* Environment Data */}
        {currentWeather && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Environment</Text>
            <View style={styles.environmentCard}>
              <Text style={styles.locationText}>{currentWeather.location}</Text>
              <View style={styles.environmentRow}>
                <Text>Temperature: {currentWeather.temperature}°C</Text>
                <Text>Humidity: {currentWeather.humidity}%</Text>
              </View>
              <View style={styles.environmentRow}>
                <Text>Pollen: {currentWeather.pollenCount}</Text>
                <Text>Air Quality: {currentWeather.airQuality}</Text>
              </View>
              <View style={styles.environmentRow}>
                <Text>UV Index: {currentWeather.uvIndex}</Text>
                <Text>Weather: {currentWeather.description}</Text>
              </View>
              
              {/* Enhanced Pollen Information */}
              {currentWeather.dailyPollenInfo && currentWeather.dailyPollenInfo.length > 0 && (
                <View style={styles.pollenSection}>
                  <Text style={styles.pollenTitle}>Today's Pollen Forecast</Text>
                  {currentWeather.dailyPollenInfo[0].pollenTypes.map((pollen, index) => (
                    <View key={index} style={styles.pollenRow}>
                      <Text style={styles.pollenType}>{pollen.displayName}</Text>
                      <View style={[styles.pollenBadge, { backgroundColor: getPollenColor(pollen.category) }]}>
                        <Text style={styles.pollenCategory}>{pollen.category}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              
              {currentWeather.plantDescription && (
                <Text style={styles.plantDescription}>
                  {currentWeather.plantDescription}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Recent Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          {recentLogs.map((log) => (
            <TouchableOpacity key={log.id} style={styles.logCard}>
              <Text style={styles.logDate}>
                {new Date(log.date).toLocaleDateString()}
              </Text>
              <View style={styles.logSummary}>
                <Text>Rash: {log.symptoms.rash}</Text>
                <Text>Cough: {log.symptoms.cough}</Text>
                <Text>Mood: {log.mood}/5</Text>
              </View>
              {log.triggers.length > 0 && (
                <Text style={styles.logTriggers}>
                  Triggers: {log.triggers.join(', ')}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Add Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Report</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    marginTop: 4,
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
    marginBottom: 12,
    color: '#333',
  },
  childCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedChildCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  childName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  childAge: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusTextIncomplete: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF9800',
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  symptomsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  environmentCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },  environmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pollenSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pollenTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pollenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pollenType: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  pollenBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  pollenCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  plantDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 16,
  },
  logCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  logDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  logSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logTriggers: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { loadDummyData } from '../store/slices/childrenSlice';
import { loadDummyLogs } from '../store/slices/logsSlice';
import { fetchCurrentWeather, fetchCurrentLocationWeather, fetchCurrentLocationWeatherPublic } from '../store/slices/environmentSlice';

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
  const navigation = useNavigation();
  const { selectedChild, children } = useAppSelector((state) => state.children);
  const { logs } = useAppSelector((state) => state.logs);
  const { currentWeather } = useAppSelector((state) => state.environment);  useEffect(() => {
    // Load dummy data for UI prototyping
    dispatch(loadDummyData());
    dispatch(loadDummyLogs());
    
    // Debug: Log the current weather data
    console.log('Current weather data:', currentWeather);
    
    // Try to get current location first, fallback to New York
    dispatch(fetchCurrentLocationWeatherPublic()).catch(() => {
      console.log('Location fetch failed, using fallback');
      dispatch(fetchCurrentWeather('New York, NY'));
    });
  }, [dispatch]);

  // Debug effect to monitor weather data changes
  useEffect(() => {
    console.log('Weather data updated:', currentWeather);
    if (currentWeather?.dailyPollenInfo) {
      console.log('Pollen data available:', currentWeather.dailyPollenInfo);
    } else {
      console.log('No pollen data in weather response');
    }
  }, [currentWeather]);

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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Environment</Text>
              <TouchableOpacity 
                style={styles.viewMoreButton}
                onPress={() => navigation.navigate('Pollen' as never)}
              >
                <Text style={styles.viewMoreText}>View Pollen Details →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.environmentCard}>
              <Text style={styles.locationText}>{currentWeather.location}</Text>
              <View style={styles.environmentRow}>
                <Text>Temperature: {currentWeather.temperature}°C</Text>
                <Text>Humidity: {currentWeather.humidity}%</Text>
              </View>
              <View style={styles.environmentRow}>
                <Text>Air Quality: {currentWeather.airQuality}</Text>
                <Text>UV Index: {currentWeather.uvIndex}</Text>
              </View>
              
              {/* Pollen Overview */}
              <View style={styles.pollenOverview}>
                <Text style={styles.pollenOverviewTitle}>🌸 Pollen Level</Text>
                <View style={[styles.pollenLevelBadge, { backgroundColor: getPollenColor(currentWeather.pollenCount || 'moderate') }]}>
                  <Text style={styles.pollenLevelText}>
                    {(currentWeather.pollenCount || 'moderate').toUpperCase()}
                  </Text>
                </View>
              </View>
                {/* Quick Pollen Info */}
              {currentWeather.dailyPollenInfo && currentWeather.dailyPollenInfo.length > 0 ? (
                <View style={styles.quickPollenInfo}>
                  <Text style={styles.quickPollenTitle}>Today's Top Pollen Types:</Text>
                  {currentWeather.dailyPollenInfo[0].pollenTypes.slice(0, 3).map((pollen, index) => (
                    <View key={index} style={styles.quickPollenItem}>
                      <Text style={styles.quickPollenName}>{pollen.displayName}</Text>
                      <View style={[styles.quickPollenBadge, { backgroundColor: getPollenColor(pollen.category) }]}>
                        <Text style={styles.quickPollenCategory}>{pollen.category}</Text>
                      </View>
                    </View>
                  ))}
                  
                  {/* Pollen Summary */}
                  {currentWeather.pollenSummary && (
                    <View style={styles.pollenSummary}>
                      <Text style={styles.pollenSummaryTitle}>📊 Quick Summary</Text>
                      <Text style={styles.pollenSummaryText}>
                        Dominant: {currentWeather.pollenSummary.todayDominant} • Index: {currentWeather.pollenSummary.todayIndex}
                      </Text>
                      <Text style={styles.pollenSummaryText}>
                        Peak: {currentWeather.pollenSummary.peakDay} • {currentWeather.pollenSummary.forecastDays} days forecast
                      </Text>
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => navigation.navigate('Pollen' as never)}
                  >
                    <Text style={styles.viewDetailsText}>View Full Forecast</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.limitedPollenInfo}>
                  <Text style={styles.limitedPollenTitle}>ℹ️ Limited Pollen Data</Text>
                  <Text style={styles.limitedPollenText}>
                    Detailed pollen forecast requires Google Pollen API setup
                  </Text>
                  <TouchableOpacity 
                    style={styles.setupButton}
                    onPress={() => navigation.navigate('Pollen' as never)}
                  >
                    <Text style={styles.setupButtonText}>Setup & Learn More</Text>
                  </TouchableOpacity>
                </View>
              )}
                {currentWeather.plantDescriptions && currentWeather.plantDescriptions.length > 0 && (
                <Text style={styles.plantDescription}>
                  {JSON.stringify(currentWeather.plantDescriptions[0])}
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
  },  plantDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 16,
  },
  debugSection: {
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 2,
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
  },  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // New styles for enhanced pollen display
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewMoreButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewMoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  pollenOverview: {
    backgroundColor: '#f0f8f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  pollenOverviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  pollenLevelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pollenLevelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickPollenInfo: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickPollenTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  quickPollenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickPollenName: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  quickPollenBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  quickPollenCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  viewDetailsButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  limitedPollenInfo: {
    backgroundColor: '#fff8e1',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ffcc02',
  },
  limitedPollenTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f57c00',
    marginBottom: 6,
  },
  limitedPollenText: {
    fontSize: 12,
    color: '#ef6c00',
    marginBottom: 8,
    lineHeight: 16,
  },  setupButton: {
    backgroundColor: '#ff9800',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  setupButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  pollenSummary: {
    backgroundColor: '#f0f8f0',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  pollenSummaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 4,
  },
  pollenSummaryText: {
    fontSize: 11,
    color: '#388e3c',
    lineHeight: 14,
  },
});

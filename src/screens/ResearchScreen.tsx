import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchResearchFeed } from '../store/slices/researchSlice';

export default function ResearchScreen() {
  const dispatch = useAppDispatch();
  const { articles, isLoading } = useAppSelector((state) => state.research);

  useEffect(() => {
    dispatch(fetchResearchFeed());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Research Feed</Text>
        <Text style={styles.headerSubtitle}>Latest allergy & health research</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {articles.map((article) => (
          <TouchableOpacity key={article.id} style={styles.articleCard}>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleSource}>{article.source}</Text>
            <Text style={styles.articleSummary}>{article.summary}</Text>
            {article.aiSummary && (
              <View style={styles.aiSummaryContainer}>
                <Text style={styles.aiSummaryLabel}>AI Summary:</Text>
                <Text style={styles.aiSummaryText}>{article.aiSummary}</Text>
              </View>
            )}
            <Text style={styles.articleDate}>
              {new Date(article.publishedAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
        
        {articles.length === 0 && !isLoading && (
          <View style={styles.section}>
            <Text style={styles.emptyText}>Loading research articles...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  scrollView: {
    flex: 1,
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
  articleCard: {
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
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  articleSource: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
    marginBottom: 8,
  },
  articleSummary: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  aiSummaryContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  aiSummaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  aiSummaryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  articleDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
});

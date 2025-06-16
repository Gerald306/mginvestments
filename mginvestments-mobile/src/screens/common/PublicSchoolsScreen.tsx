import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { schoolService } from '../../services/schoolService';
import { SchoolCarousel, Card, Button } from '../../components';
import { School } from '../../components/SchoolCard';

interface FilterOptions {
  schoolType: string;
  location: string;
  hiringStatus: string;
}

const PublicSchoolsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, typography, shadows, spacing } = useTheme();
  
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    schoolType: '',
    location: '',
    hiringStatus: '',
  });

  const schoolTypes = [
    'Primary', 'Secondary', 'University', 'College', 'Technical', 'Vocational'
  ];

  const locations = [
    'Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu', 'Lira', 'Masaka', 'Mbale'
  ];

  const hiringStatuses = [
    'Actively Hiring', 'Open to Applications', 'Not Hiring'
  ];

  useEffect(() => {
    loadSchools();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [schools, searchQuery, filters]);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const allSchools = await schoolService.getAllSchools();
      // Filter for active and approved schools only
      const activeSchools = allSchools.filter(school => 
        school.is_active && school.status === 'approved'
      );
      setSchools(activeSchools);
    } catch (error) {
      console.error('Error loading schools:', error);
      Alert.alert('Error', 'Failed to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchools();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...schools];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(query) ||
        school.location.toLowerCase().includes(query) ||
        school.schoolType?.toLowerCase().includes(query)
      );
    }

    // Apply school type filter
    if (filters.schoolType) {
      filtered = filtered.filter(school =>
        school.schoolType?.toLowerCase() === filters.schoolType.toLowerCase()
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(school =>
        school.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply hiring status filter
    if (filters.hiringStatus) {
      if (filters.hiringStatus === 'Actively Hiring') {
        filtered = filtered.filter(school => school.isActivelyHiring === true);
      } else if (filters.hiringStatus === 'Not Hiring') {
        filtered = filtered.filter(school => school.isActivelyHiring === false);
      }
      // 'Open to Applications' includes all schools
    }

    setFilteredSchools(filtered);
  };

  const clearFilters = () => {
    setFilters({
      schoolType: '',
      location: '',
      hiringStatus: '',
    });
    setSearchQuery('');
  };

  const handleSchoolPress = (school: School) => {
    // Navigate to school details or show school profile modal
    Alert.alert(
      school.name,
      `Type: ${school.schoolType || 'School'}\nLocation: ${school.location}\nTeachers: ${school.teacherCount || 'N/A'}\n${school.isActivelyHiring ? 'Currently hiring teachers' : 'Not actively hiring'}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Contact', onPress: () => console.log('Contact school:', school.id) },
      ]
    );
  };

  const renderFilterSection = () => (
    <Card style={[styles.filterCard, shadows.md]}>
      <View style={styles.filterHeader}>
        <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>
          Filter Schools
        </Text>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Ionicons 
            name={showFilters ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterContent}>
          {/* School Type Filter */}
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>School Type</Text>
            <View style={styles.filterOptions}>
              {schoolTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filters.schoolType === type 
                        ? colors.school.primary 
                        : colors.surface,
                      borderColor: filters.schoolType === type 
                        ? colors.school.primary 
                        : colors.border,
                    }
                  ]}
                  onPress={() => setFilters(prev => ({
                    ...prev,
                    schoolType: prev.schoolType === type ? '' : type
                  }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    {
                      color: filters.schoolType === type 
                        ? colors.white 
                        : colors.textSecondary
                    }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location Filter */}
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>Location</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: filters.location === location 
                          ? colors.primary 
                          : colors.surface,
                        borderColor: filters.location === location 
                          ? colors.primary 
                          : colors.border,
                      }
                    ]}
                    onPress={() => setFilters(prev => ({
                      ...prev,
                      location: prev.location === location ? '' : location
                    }))}
                  >
                    <Text style={[
                      styles.filterChipText,
                      {
                        color: filters.location === location 
                          ? colors.white 
                          : colors.textSecondary
                      }
                    ]}>
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Hiring Status Filter */}
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>Hiring Status</Text>
            <View style={styles.filterOptions}>
              {hiringStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filters.hiringStatus === status 
                        ? colors.success 
                        : colors.surface,
                      borderColor: filters.hiringStatus === status 
                        ? colors.success 
                        : colors.border,
                    }
                  ]}
                  onPress={() => setFilters(prev => ({
                    ...prev,
                    hiringStatus: prev.hiringStatus === status ? '' : status
                  }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    {
                      color: filters.hiringStatus === status 
                        ? colors.white 
                        : colors.textSecondary
                    }
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button
            title="Clear Filters"
            onPress={clearFilters}
            variant="outline"
            size="small"
            icon="refresh-outline"
            style={styles.clearButton}
          />
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.school.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.school.primary, colors.school.light]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.white }]}>
              Browse Schools
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.white }]}>
              {filteredSchools.length} partner schools available
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.white }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search schools by name, type, or location..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.school.primary]}
            tintColor={colors.school.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Section */}
        {renderFilterSection()}

        {/* Results */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsTitle, { color: colors.textPrimary }]}>
              Search Results
            </Text>
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              {filteredSchools.length} schools found
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading schools...
              </Text>
            </View>
          ) : filteredSchools.length > 0 ? (
            <SchoolCarousel
              schools={filteredSchools}
              title=""
              subtitle=""
              onSchoolPress={handleSchoolPress}
              variant="default"
              showViewAll={false}
              horizontal={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : (
            <Card style={[styles.emptyCard, shadows.sm]}>
              <View style={styles.emptyContent}>
                <Ionicons name="business-outline" size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  No Schools Found
                </Text>
                <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                  Try adjusting your search criteria or filters to find more schools.
                </Text>
                <Button
                  title="Clear Filters"
                  onPress={clearFilters}
                  variant="outline"
                  size="small"
                  icon="refresh-outline"
                  style={styles.emptyButton}
                />
              </View>
            </Card>
          )}
        </View>

        {/* Hiring Banner */}
        {filteredSchools.some(school => school.isActivelyHiring) && (
          <Card style={[styles.hiringBanner, shadows.md]}>
            <LinearGradient
              colors={[colors.success, colors.successLight]}
              style={styles.hiringGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.hiringContent}>
                <Ionicons name="briefcase" size={32} color={colors.white} />
                <Text style={[styles.hiringTitle, { color: colors.white }]}>
                  Schools Are Hiring!
                </Text>
                <Text style={[styles.hiringSubtitle, { color: colors.white }]}>
                  {filteredSchools.filter(school => school.isActivelyHiring).length} schools are actively looking for teachers
                </Text>
                <Button
                  title="View Hiring Schools"
                  onPress={() => setFilters(prev => ({ ...prev, hiringStatus: 'Actively Hiring' }))}
                  variant="secondary"
                  size="medium"
                  icon="arrow-forward-outline"
                  style={styles.hiringButton}
                />
              </View>
            </LinearGradient>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  filterCard: {
    padding: 16,
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterContent: {
    marginTop: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 14,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyCard: {
    padding: 40,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    minWidth: 120,
  },
  hiringBanner: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  hiringGradient: {
    padding: 24,
  },
  hiringContent: {
    alignItems: 'center',
  },
  hiringTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  hiringSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  hiringButton: {
    minWidth: 180,
  },
});

export default PublicSchoolsScreen;

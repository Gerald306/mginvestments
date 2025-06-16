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
import { teacherService } from '../../services/teacherService';
import { TeacherCarousel, Card, Button } from '../../components';
import { Teacher } from '../../components/TeacherCard';

interface FilterOptions {
  subject: string;
  location: string;
  experience: string;
  availability: string;
}

const PublicTeachersScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, typography, shadows, spacing } = useTheme();
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    subject: '',
    location: '',
    experience: '',
    availability: '',
  });

  const subjects = [
    'Mathematics', 'English', 'Science', 'History', 'Geography',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art'
  ];

  const locations = [
    'Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu', 'Lira', 'Masaka', 'Mbale'
  ];

  const experienceLevels = [
    '0-2 years', '3-5 years', '6-10 years', '10+ years'
  ];

  const availabilityOptions = [
    'Full-time', 'Part-time', 'Contract', 'Substitute'
  ];

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [teachers, searchQuery, filters]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const allTeachers = await teacherService.getAllTeachers();
      // Filter for active and approved teachers only
      const activeTeachers = allTeachers.filter(teacher => 
        teacher.is_active && teacher.status === 'approved'
      );
      setTeachers(activeTeachers);
    } catch (error) {
      console.error('Error loading teachers:', error);
      Alert.alert('Error', 'Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeachers();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...teachers];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(teacher =>
        teacher.full_name.toLowerCase().includes(query) ||
        teacher.subject_specialization.toLowerCase().includes(query) ||
        teacher.location.toLowerCase().includes(query)
      );
    }

    // Apply subject filter
    if (filters.subject) {
      filtered = filtered.filter(teacher =>
        teacher.subject_specialization.toLowerCase().includes(filters.subject.toLowerCase())
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(teacher =>
        teacher.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply experience filter
    if (filters.experience) {
      const [min, max] = getExperienceRange(filters.experience);
      filtered = filtered.filter(teacher =>
        teacher.experience_years >= min && (max === null || teacher.experience_years <= max)
      );
    }

    // Apply availability filter
    if (filters.availability) {
      filtered = filtered.filter(teacher =>
        teacher.availability?.toLowerCase() === filters.availability.toLowerCase()
      );
    }

    setFilteredTeachers(filtered);
  };

  const getExperienceRange = (experience: string): [number, number | null] => {
    switch (experience) {
      case '0-2 years': return [0, 2];
      case '3-5 years': return [3, 5];
      case '6-10 years': return [6, 10];
      case '10+ years': return [10, null];
      default: return [0, null];
    }
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      location: '',
      experience: '',
      availability: '',
    });
    setSearchQuery('');
  };

  const handleTeacherPress = (teacher: Teacher) => {
    // Navigate to teacher details or show teacher profile modal
    Alert.alert(
      teacher.full_name,
      `Subject: ${teacher.subject_specialization}\nLocation: ${teacher.location}\nExperience: ${teacher.experience_years} years`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Contact', onPress: () => console.log('Contact teacher:', teacher.id) },
      ]
    );
  };

  const renderFilterSection = () => (
    <Card style={[styles.filterCard, shadows.md]}>
      <View style={styles.filterHeader}>
        <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>
          Filter Teachers
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
          {/* Subject Filter */}
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>Subject</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: filters.subject === subject 
                          ? colors.teacher.primary 
                          : colors.surface,
                        borderColor: filters.subject === subject 
                          ? colors.teacher.primary 
                          : colors.border,
                      }
                    ]}
                    onPress={() => setFilters(prev => ({
                      ...prev,
                      subject: prev.subject === subject ? '' : subject
                    }))}
                  >
                    <Text style={[
                      styles.filterChipText,
                      {
                        color: filters.subject === subject 
                          ? colors.white 
                          : colors.textSecondary
                      }
                    ]}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
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

          {/* Experience Filter */}
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>Experience</Text>
            <View style={styles.filterOptions}>
              {experienceLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filters.experience === level 
                        ? colors.success 
                        : colors.surface,
                      borderColor: filters.experience === level 
                        ? colors.success 
                        : colors.border,
                    }
                  ]}
                  onPress={() => setFilters(prev => ({
                    ...prev,
                    experience: prev.experience === level ? '' : level
                  }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    {
                      color: filters.experience === level 
                        ? colors.white 
                        : colors.textSecondary
                    }
                  ]}>
                    {level}
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
      <StatusBar barStyle="light-content" backgroundColor={colors.teacher.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.teacher.primary, colors.teacher.light]}
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
              Browse Teachers
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.white }]}>
              {filteredTeachers.length} qualified teachers available
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.white }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search teachers by name, subject, or location..."
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
            colors={[colors.teacher.primary]}
            tintColor={colors.teacher.primary}
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
              {filteredTeachers.length} teachers found
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading teachers...
              </Text>
            </View>
          ) : filteredTeachers.length > 0 ? (
            <TeacherCarousel
              teachers={filteredTeachers}
              title=""
              subtitle=""
              onTeacherPress={handleTeacherPress}
              variant="default"
              showViewAll={false}
              horizontal={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : (
            <Card style={[styles.emptyCard, shadows.sm]}>
              <View style={styles.emptyContent}>
                <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  No Teachers Found
                </Text>
                <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                  Try adjusting your search criteria or filters to find more teachers.
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
});

export default PublicTeachersScreen;

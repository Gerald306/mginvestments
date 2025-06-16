import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import TeacherCard, { Teacher } from './TeacherCard';
import Button from './Button';

const { width } = Dimensions.get('window');

interface TeacherCarouselProps {
  teachers: Teacher[];
  title?: string;
  subtitle?: string;
  onTeacherPress?: (teacher: Teacher) => void;
  onViewAllPress?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  showViewAll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
  horizontal?: boolean;
}

const TeacherCarousel: React.FC<TeacherCarouselProps> = ({
  teachers,
  title = 'Qualified Teachers',
  subtitle = 'Discover amazing educators ready to make a difference',
  onTeacherPress,
  onViewAllPress,
  variant = 'default',
  showViewAll = true,
  refreshing = false,
  onRefresh,
  emptyMessage = 'No teachers available at the moment',
  horizontal = true,
}) => {
  const { colors, typography, shadows, spacing } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    if (!horizontal) return;
    
    const contentOffset = event.nativeEvent.contentOffset.x;
    const cardWidth = variant === 'compact' ? 280 : 300;
    const index = Math.round(contentOffset / cardWidth);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollViewRef.current || !horizontal) return;
    
    const cardWidth = variant === 'compact' ? 280 : 300;
    scrollViewRef.current.scrollTo({
      x: index * cardWidth,
      animated: true,
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.teacher.soft }]}>
        <Ionicons name="people-outline" size={48} color={colors.teacher.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        No Teachers Found
      </Text>
      <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
        {emptyMessage}
      </Text>
      {onRefresh && (
        <Button
          title="Refresh"
          onPress={onRefresh}
          variant="outline"
          size="small"
          icon="refresh-outline"
          style={styles.refreshButton}
        />
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showViewAll && onViewAllPress && teachers.length > 0 && (
        <Button
          title="View All"
          onPress={onViewAllPress}
          variant="ghost"
          size="small"
          icon="arrow-forward-outline"
          iconPosition="right"
        />
      )}
    </View>
  );

  const renderPaginationDots = () => {
    if (!horizontal || teachers.length <= 1) return null;

    const visibleCards = Math.floor(width / (variant === 'compact' ? 280 : 300));
    const totalPages = Math.ceil(teachers.length / visibleCards);

    if (totalPages <= 1) return null;

    return (
      <View style={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === Math.floor(currentIndex / visibleCards)
                  ? colors.teacher.primary
                  : colors.textTertiary,
              },
            ]}
            onPress={() => scrollToIndex(index * visibleCards)}
          />
        ))}
      </View>
    );
  };

  const renderTeacherList = () => {
    if (horizontal) {
      return (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={variant === 'compact' ? 280 : 300}
          decelerationRate="fast"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.teacher.primary]}
                tintColor={colors.teacher.primary}
              />
            ) : undefined
          }
        >
          {teachers.map((teacher, index) => (
            <View
              key={teacher.id || index}
              style={[
                styles.cardContainer,
                {
                  width: variant === 'compact' ? 260 : 280,
                  marginRight: index === teachers.length - 1 ? 20 : 16,
                },
              ]}
            >
              <TeacherCard
                teacher={teacher}
                onPress={onTeacherPress}
                variant={variant}
              />
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verticalContainer}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.teacher.primary]}
              tintColor={colors.teacher.primary}
            />
          ) : undefined
        }
      >
        {teachers.map((teacher, index) => (
          <TeacherCard
            key={teacher.id || index}
            teacher={teacher}
            onPress={onTeacherPress}
            variant={variant}
          />
        ))}
      </ScrollView>
    );
  };

  if (teachers.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTeacherList()}
      {renderPaginationDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  horizontalContainer: {
    paddingLeft: 20,
  },
  verticalContainer: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 0,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  refreshButton: {
    minWidth: 120,
  },
});

export default TeacherCarousel;

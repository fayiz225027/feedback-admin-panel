import React from 'react';
import { MessageSquareText, Star, Award, BookOpen } from 'lucide-react';

const SummaryCards = ({ feedbackList = [] }) => {
  const total = feedbackList.length;

  const avgRating = total > 0
    ? (feedbackList.reduce((acc, curr) => acc + (Number(curr.feedbackRating) || 0), 0) / total).toFixed(1)
    : '0.0';

  const highRatingsCount = feedbackList.filter(
    (item) => Number(item.feedbackRating) >= 4
  ).length;

  const satisfactionRate = total > 0 ? Math.round((highRatingsCount / total) * 100) : 0;

  const uniqueCourses = new Set(
    feedbackList.map((item) => (item.courseName || '').trim().toLowerCase())
  ).size;

  const cards = [
    {
      title: 'Total Feedbacks',
      value: total,
      subtext: total === 1 ? '1 student review' : `${total} student reviews`,
      icon: MessageSquareText,
      color: 'indigo',
    },
    {
      title: 'Average Rating',
      value: `${avgRating} / 5.0`,
      subtext: 'Overall course satisfaction',
      icon: Star,
      color: 'amber',
    },
    {
      title: 'High Satisfaction (4-5★)',
      value: `${satisfactionRate}%`,
      subtext: `${highRatingsCount} out of ${total} reviews`,
      icon: Award,
      color: 'emerald',
    },
    {
      title: 'Active Courses',
      value: uniqueCourses,
      subtext: 'Unique courses reviewed',
      icon: BookOpen,
      color: 'blue',
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div key={idx} className={`stat-card stat-${card.color}`}>
            <div className="stat-content">
              <span className="stat-title">{card.title}</span>
              <span className="stat-value">{card.value}</span>
              <span className="stat-subtext">{card.subtext}</span>
            </div>
            <div className={`stat-icon-wrapper bg-${card.color}`}>
              <IconComponent size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;

const getBadgeType = severity => {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'warning';
  }
};

export default getBadgeType;

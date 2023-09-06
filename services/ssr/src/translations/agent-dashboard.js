import { defineMessages } from 'react-intl';

export const agentDashboardMessages = defineMessages({
  title: {
    id: 'agent-dashboard.title',
    defaultMessage: 'Agent Dashboard | STS',
  },
  sectionTitleMyOpen: {
    id: 'agent-dashboard.my-open',
    defaultMessage: 'Open tickets assigned to you',
  },
  sectionTitleMyInProgress: {
    id: 'agent-dashboard.my-in-progress',
    defaultMessage: 'In-progress tickets assigned to you',
  },
  sectionTitleNewToday: {
    id: 'agent-dashboard.new-today',
    defaultMessage: 'New tickets today',
  },
  sectionTitleTriage: {
    id: 'agent-dashboard.section-title-triage',
    defaultMessage: 'Triage - new tickets today',
  },
  emptyState: {
    id: 'agent-dashboard.empty-state',
    defaultMessage: 'Nothing to see here',
  },
});

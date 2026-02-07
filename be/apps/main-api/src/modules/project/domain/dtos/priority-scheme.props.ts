export interface DefaultPriorityData {
  name: string;
  score: number;
  color: string;
  icon: string;
}

export interface DefaultSchemeTemplate {
  name: string;
  isDefault: boolean;
  priorities: DefaultPriorityData[];
}

export const DEFAULT_PRIORITY_SCHEMES: DefaultSchemeTemplate[] = [
  {
    name: 'Base Priority Schema',
    isDefault: true,
    priorities: [
      { name: 'Urgent', score: 100, color: '#FF0000', icon: 'urgent' },
      { name: 'High', score: 75, color: '#FF6B00', icon: 'high' },
      { name: 'Medium', score: 50, color: '#FFCC00', icon: 'medium' },
      { name: 'Low', score: 25, color: '#00CC00', icon: 'low' },
      { name: 'None', score: 0, color: '#808080', icon: 'none' },
    ],
  },
  {
    name: 'Marketing (MKT)',
    isDefault: false,
    priorities: [
      { name: 'Campaign Critical', score: 100, color: '#E91E63', icon: 'campaign-critical' },
      { name: 'Launch Priority', score: 80, color: '#9C27B0', icon: 'launch' },
      { name: 'Content Deadline', score: 60, color: '#673AB7', icon: 'content' },
      { name: 'Scheduled', score: 40, color: '#3F51B5', icon: 'scheduled' },
      { name: 'Backlog', score: 20, color: '#607D8B', icon: 'backlog' },
    ],
  },
  {
    name: 'Sales (SALE)',
    isDefault: false,
    priorities: [
      { name: 'Deal Closing', score: 100, color: '#F44336', icon: 'deal-closing' },
      { name: 'Hot Lead', score: 85, color: '#FF5722', icon: 'hot-lead' },
      { name: 'Qualified Lead', score: 65, color: '#FF9800', icon: 'qualified' },
      { name: 'Nurturing', score: 45, color: '#FFC107', icon: 'nurturing' },
      { name: 'Cold Outreach', score: 20, color: '#9E9E9E', icon: 'cold' },
    ],
  },
  {
    name: 'IT Department',
    isDefault: false,
    priorities: [
      { name: 'P1 - Critical', score: 100, color: '#D32F2F', icon: 'p1-critical' },
      { name: 'P2 - High', score: 75, color: '#F57C00', icon: 'p2-high' },
      { name: 'P3 - Medium', score: 50, color: '#FBC02D', icon: 'p3-medium' },
      { name: 'P4 - Low', score: 25, color: '#388E3C', icon: 'p4-low' },
      { name: 'P5 - Planning', score: 10, color: '#1976D2', icon: 'p5-planning' },
    ],
  },
];

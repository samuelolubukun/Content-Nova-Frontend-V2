import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  defaultTab, 
  activeTab: controlledActiveTab, 
  onTabChange 
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  // Use controlled or internal state
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  
  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8 overflow-x-auto overflow-y-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ease-in-out",
                activeTab === tab.id
                  ? "border-brand-gradient bg-clip-text text-transparent bg-gradient-brand transform scale-105"
                  : "border-transparent text-muted-foreground hover:bg-clip-text hover:text-transparent hover:bg-gradient-brand hover:scale-102"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div 
        key={activeTab}
        className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
      >
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;
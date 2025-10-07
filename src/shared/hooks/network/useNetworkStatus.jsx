import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  WifiOff, 
  RotateCw, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Database
} from 'lucide-react';
import { offlineFormHandler } from '@/shared/utils/offlineFormHandler';

const NetworkStatusMonitor = ({ className = "" }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [syncStatus, setSyncStatus] = useState('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Network status listeners
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      updateStats();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
      updateStats();
    };

    // Connection type detection
    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const conn = navigator.connection;
        setConnectionType(conn.effectiveType || conn.type || 'unknown');
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateConnectionInfo);
    }

    // Service worker sync events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }

    // Initial setup
    updateConnectionInfo();
    updateStats();

    // Periodic stats update
    const statsInterval = setInterval(updateStats, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateConnectionInfo);
      }
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
      
      clearInterval(statsInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSWMessage = (event) => {
    if (event.data) {
      switch (event.data.type) {
        case 'SYNC_STARTED':
          setSyncStatus('syncing');
          setSyncProgress(0);
          break;
        case 'SYNC_PROGRESS':
          setSyncProgress(event.data.progress || 0);
          break;
        case 'SYNC_SUCCESS':
          setSyncStatus('success');
          setSyncProgress(100);
          setLastSyncTime(new Date());
          setTimeout(() => setSyncStatus('idle'), 3000);
          updateStats();
          break;
        case 'SYNC_FAILED':
          setSyncStatus('failed');
          setTimeout(() => setSyncStatus('idle'), 5000);
          break;
        default:
          break;
      }
    }
  };

  const updateStats = async () => {
    try {
      const newStats = await offlineFormHandler.getStats();
      setStats(newStats);
      setPendingCount(newStats?.pending || 0);
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };

  const handleManualSync = async () => {
    if (!isOnline) return;
    
    setSyncStatus('syncing');
    try {
      await offlineFormHandler.syncOfflineData();
      setSyncStatus('success');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (syncError) {
      console.error('Manual sync failed:', syncError);
      setSyncStatus('failed');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
    updateStats();
  };

  const handleRetryFailed = async () => {
    setSyncStatus('syncing');
    try {
      const retryCount = await offlineFormHandler.retryFailedSubmissions();
      if (retryCount > 0) {
        setSyncStatus('success');
      } else {
        setSyncStatus('idle');
      }
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (retryError) {
      console.error('Retry failed submissions failed:', retryError);
      setSyncStatus('failed');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
    updateStats();
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4 text-red-500" />;
    
    switch (syncStatus) {
      case 'syncing':
        return <RotateCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return 'Synced';
      case 'failed':
        return 'Sync Failed';
      default:
        return 'Online';
    }
  };

  const getConnectionBadgeColor = () => {
    if (!isOnline) return 'destructive';
    if (pendingCount > 0) return 'warning';
    return 'secondary';
  };

  if (!showDetails) {
    // Compact view
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div 
          className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setShowDetails(true)}
        >
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
          {pendingCount > 0 && (
            <Badge variant={getConnectionBadgeColor()} className="text-xs">
              {pendingCount}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={`p-4 max-w-sm ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(false)}
            className="p-1"
          >
            ×
          </Button>
        </div>

        {/* Connection Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <Badge variant={getConnectionBadgeColor()}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          
          {connectionType !== 'unknown' && (
            <div className="flex justify-between text-sm">
              <span>Connection:</span>
              <span className="text-muted-foreground">{connectionType}</span>
            </div>
          )}
          
          {lastSyncTime && (
            <div className="flex justify-between text-sm">
              <span>Last Sync:</span>
              <span className="text-muted-foreground">
                {lastSyncTime.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Sync Progress */}
        {syncStatus === 'syncing' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Syncing data...</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-4 h-4" />
              <span>Data Status</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className={stats.pending > 0 ? 'text-yellow-600' : 'text-muted-foreground'}>
                  {stats.pending}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Synced:</span>
                <span className="text-green-600">{stats.synced}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className={stats.failed > 0 ? 'text-red-600' : 'text-muted-foreground'}>
                  {stats.failed}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="text-muted-foreground">{stats.total}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isOnline && pendingCount > 0 && (
            <Button
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing'}
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Sync Now
            </Button>
          )}
          
          {stats?.failed > 0 && (
            <Button
              onClick={handleRetryFailed}
              disabled={syncStatus === 'syncing'}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Clock className="w-4 h-4 mr-1" />
              Retry Failed
            </Button>
          )}
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
              <WifiOff className="w-4 h-4" />
              <span>You're offline. Form submissions will be saved locally and synced when connection is restored.</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default NetworkStatusMonitor;
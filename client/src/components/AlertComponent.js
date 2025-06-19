import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';
import { removeAlert } from '../features/alert/alertSlice';

const AlertComponent = () => {
  const alerts = useSelector(state => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set timeouts to auto-dismiss alerts
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeAlert(alerts[0].id));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alerts, dispatch]);

  return (
    <div>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={alert.type}
            onClose={() => dispatch(removeAlert(alert.id))}
          >
            {alert.msg}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

export default AlertComponent;
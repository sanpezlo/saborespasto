import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import Notification, { NotificationProps } from "@/components/notification";

type NotificationContext = {
  setNotification: Dispatch<SetStateAction<NotificationProps | null>>;
};

const NotificationContext = createContext<NotificationContext>({
  setNotification: () => {},
});

type NotificationProviderProps = {
  children?: ReactNode;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationProps | null>(
    null
  );
  return (
    <NotificationContext.Provider value={{ setNotification }}>
      {notification && (
        <Notification
          title={notification.title}
          description={notification.description}
          onClose={() => setNotification(null)}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}

import React, { useMemo } from "react";
import Avatar from "./Avatar";  // Use default import for Avatar
import { useOthers, useSelf } from "@/liveblocks.config";
import styles from "./index.module.css";
import { generateRandomName } from "@/lib/utils";

const ActiveUsers = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;


  const memorizedUsers = useMemo(() => {
    return (
      <div className="flex items-center justify-center gap-1  mt-4">
      <div className="flex pl-3 mt-4">
        {currentUser && (
          <Avatar name="You" otherStyles="border-[3px] border-primary-green" />
        )}

        {users.slice(0, 3).map(({ connectionId }) => (
          <Avatar key={connectionId} name={generateRandomName()} otherStyles="-ml-3" />
        ))}

        {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
      </div>
    </div>
    )
  }, [users.length])
  return memorizedUsers;
};

export default ActiveUsers;

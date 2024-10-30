import { useEffect, useState } from "react";
import { fetchGroups } from "../lib/utils";
import { Options } from "../shared/types";
const useFetchGroups = (userUid: string | undefined) => {
  const [groups, setGroups] = useState<Options[]>([]);
  const [currentActivityId, setCurrentActivityId] = useState("");
  const [currentGroupId, setCurrentGroupId] = useState("");

  useEffect(() => {
    if (userUid) {
      const fetchGroupData = async () => {
        try {
          const groups = await fetchGroups(userUid);

          const groupOptions: Options[] = [];

          groups.forEach((doc) => {
            const groupId = doc.id;
            const groupName = doc.data().groupName;
            const activityId = doc.data().activityId;
            const groupInfo = {
              id: groupId,
              value: groupName,
            };
            if (activityId) {
              setCurrentActivityId(activityId);
              setCurrentGroupId(groupId);
            }
            groupOptions.push(groupInfo);
          });
          setGroups(groupOptions);
        } catch (err) {
          console.log("Error fetching groups");
        }
      };
      fetchGroupData();
    }
  }, [userUid]);

  return { groups, currentActivityId, currentGroupId } as const;
};

export default useFetchGroups;

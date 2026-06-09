# Stage 1

## Priority Inbox Algorithm

### Approach
Notifications are prioritized based on two factors:
1. **Type Weight**: Placement (3) > Result (2) > Event (1)
2. **Recency**: More recent notifications rank higher within same type

### Formula
Priority Score = Weight × 10^13 + Timestamp (in milliseconds)

### How it maintains Top 10 efficiently
- Fetch all notifications from API
- Calculate priority score for each
- Sort in descending order
- Return top 10

### New Notifications
When new notifications arrive, re-sort and re-slice top 10.

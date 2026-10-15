export function getUpcomingDates(daysAhead = 30) {
   const now = new Date();
   const gte = now.toISOString().slice(0, 10);

   const future = new Date(now.getTime() + daysAhead * 86400000);
   const lte = future.toISOString().slice(0, 10);

   return { gte, lte };
}

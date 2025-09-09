declare module '@fullcalendar/react' {
	import { ComponentType } from 'react';
	const FullCalendar: ComponentType<any>;
	export default FullCalendar;
}

declare module '@fullcalendar/daygrid' {
	const dayGridPlugin: any;
	export default dayGridPlugin;
}

declare module '@fullcalendar/timegrid' {
	const timeGridPlugin: any;
	export default timeGridPlugin;
}

declare module '@fullcalendar/interaction' {
	const interactionPlugin: any;
	export default interactionPlugin;
}

declare module '*.css' {
	const content: { [className: string]: string };
	export default content;
}

declare module '@fullcalendar/common' {
	export const formatDate: any;
}

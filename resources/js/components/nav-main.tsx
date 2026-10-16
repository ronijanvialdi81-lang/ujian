import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavGroup, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

interface NavMainProps {
    items?: NavItem[];
    groups?: NavGroup[];
}

export function NavMain({ items, groups }: NavMainProps) {
    const page = usePage();

    // Normalize input to groups
    const resolvedGroups: NavGroup[] = groups || (items ? [{ title: 'MENU UTAMA', items }] : []);

    return (
        <div className="flex flex-col gap-3 py-1">
            {resolvedGroups.map((group) => (
                <SidebarGroup key={group.title} className="px-2 py-0">
                    <SidebarGroupLabel className="text-xs font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase px-2 mb-1">
                        {group.title}
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-1">
                        {group.items.map((item) => {
                            const hasSubItems = Boolean(item.items && item.items.length > 0);
                            const isChildActive = hasSubItems && item.items?.some((sub) => sub.url && page.url.startsWith(sub.url));
                            const isActive = item.url === page.url || isChildActive;

                            if (hasSubItems && item.items) {
                                return (
                                    <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    tooltip={item.title}
                                                    isActive={isActive}
                                                    className="w-full justify-between hover:bg-purple-50 dark:hover:bg-purple-950/30 text-gray-700 dark:text-gray-200"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        {item.icon && <item.icon className="size-4.5 text-blue-500 dark:text-blue-400 shrink-0" />}
                                                        <span className="font-medium text-sm">{item.title}</span>
                                                    </div>
                                                    <ChevronDown className="size-4 text-blue-500/70 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub className="ml-5 pl-2 border-l border-purple-200 dark:border-purple-800/40 my-1 space-y-0.5">
                                                    {item.items.map((subItem) => {
                                                        const isSubActive = subItem.url === page.url;
                                                        return (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                                                    <Link
                                                                        href={subItem.url || '#'}
                                                                        prefetch
                                                                        className={`text-xs py-1.5 font-normal ${
                                                                            isSubActive
                                                                                ? 'text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-900/30 rounded-md'
                                                                                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
                                                                        }`}
                                                                    >
                                                                        <span>{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            }

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.url === page.url}
                                        className="hover:bg-purple-50 dark:hover:bg-purple-950/30 text-gray-700 dark:text-gray-200"
                                    >
                                        <Link href={item.url || '#'} prefetch className="flex items-center gap-2.5">
                                            {item.icon && <item.icon className="size-4.5 text-blue-500 dark:text-blue-400 shrink-0" />}
                                            <span className="font-medium text-sm">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  subject: z.string().min(1, '请选择学科'),
  grade: z.string().min(1, '请选择年级'),
  topic: z.string().min(1, '请输入课题名称'),
  chapter: z.string().optional(),
  keyPoints: z.string().optional(),
  duration: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '信息技术', '科学', '其他'];
const grades = ['小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级', '初中一年级', '初中二年级', '初中三年级', '高中一年级', '高中二年级', '高中三年级'];

export function StructuredForm({ onSubmit, onBack }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { subject: '', grade: '', topic: '', chapter: '', keyPoints: '', duration: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>学科</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="选择学科" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年级</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="选择年级" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>课题名称</FormLabel>
              <FormControl><Input placeholder="例如：一元二次方程" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chapter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>章节</FormLabel>
              <FormControl><Input placeholder="例如：第三章 第2节" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keyPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>重点知识点</FormLabel>
              <FormControl>
                <Textarea placeholder="描述本课重点知识点，用逗号或换行分隔..." className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>课时（分钟）</FormLabel>
              <FormControl><Input type="number" placeholder="45" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onBack}>上一步</Button>
          <Button type="submit" className="flex-1 bg-brand-500 hover:bg-brand-600 text-white">下一步：选择风格</Button>
        </div>
      </form>
    </Form>
  );
}

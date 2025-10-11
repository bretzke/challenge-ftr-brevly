import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import AppLayout from '@/layout/AppLayout';
import { apiClient } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PREFIX_SHORT_LINK = 'brev.ly/';
const MAX_SHORT_LINK_LENGTH = 255 - PREFIX_SHORT_LINK.length;

export default function IndexPage() {
  const formSchema = z.object({
    originalLink: z
      .url('O campo deve ser uma URL válida')
      .max(2048, 'O campo não pode exceder 2048 carácteres'),
    shortLink: z
      .string()
      .min(1, 'Campo obrigatório')
      .max(MAX_SHORT_LINK_LENGTH, `o campo não pode exceder ${MAX_SHORT_LINK_LENGTH} carácteres.`)
      .transform((slug) => `${PREFIX_SHORT_LINK}${slug}`),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalLink: '',
      shortLink: '',
    },
  });

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    try {
      await apiClient.post('/links', {
        originalLink: formValues.originalLink,
        shortLink: formValues.shortLink,
      });

      form.reset();
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status == 400) {
        form.setError('shortLink', { message: e.response?.data.message });
        return;
      }

      alert('Erro inesperado. Tente mais tarde.');
    }
  }

  return (
    <AppLayout>
      <div>
        <Card className="p-8 gap-6">
          <CardTitle className="text-lg">Novo link</CardTitle>
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="originalLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">LINK ORIGINAL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://www.exemplo.com.br" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">LINK ENCURTADO</FormLabel>
                      <FormControl>
                        <InputGroup className="[--radius:9999px]">
                          <InputGroupAddon className="text-muted-foreground pl-1.5">
                            brev.ly/
                          </InputGroupAddon>
                          <InputGroupInput {...field} placeholder="" />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="p-0">
            <Button variant="default" className="w-full" onClick={form.handleSubmit(onSubmit)}>
              Salvar link
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
